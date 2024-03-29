import { AnimatedTile } from '../types';

export class AnimatedTiles extends Phaser.Plugins.ScenePlugin {
    public scene: Phaser.Scene | null;

    private totalTime: number;
    private animatedTiles: AnimatedTile[];
    private rate: number;
    private active: boolean;
    private activeLayer: boolean[];
    private followTimeScale: boolean;

    constructor (scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, 'AnimatedTiles');

        this.scene = scene;
        this.totalTime = 0;
        this.animatedTiles = [];
        this.rate = 1;
        this.active = false;
        this.activeLayer = [];
        this.followTimeScale = true;

        if (!scene.sys.settings.isBooted) {
            scene.sys.events.once('boot', this.boot, this);
        }
    }

    public boot () {
        const eventEmitter = this.systems!.events;

        eventEmitter.on('postupdate', this.postUpdate, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    }

    public init (map, activeLayers: number[] = []) {
        const mapAnimData = this.getAnimatedTiles(map);
        const animatedTiles: AnimatedTile = {
            map: map,
            animatedTiles: mapAnimData,
            active: true,
            rate: 1,
            activeLayer: []
        };

        map.layers.forEach(function (i) {
            const index = map.layers.indexOf(i);
            animatedTiles.activeLayer.push(activeLayers.indexOf(index) > -1);
        });

        this.animatedTiles.push(animatedTiles);

        if (this.animatedTiles.length === 1) {
            this.active = true;
        }

        this.syncNewTiles(animatedTiles);
    }

    setRate (rate, gid = null, map = null) {
        if (gid === null) {
            if (map === null) {
                this.rate = rate;
            } else {
                this.animatedTiles[map].rate = rate;
            }
        } else {

            const loopThrough = function (animatedTiles) {
                animatedTiles.forEach(function (animatedTile) {
                    if (animatedTile.index === gid) {
                        animatedTile.rate = rate;
                    }
                });
            };

            if (map === null) {
                this.animatedTiles.forEach(function (animatedTiles) {
                    loopThrough(animatedTiles.animatedTiles);
                });
            } else {
                loopThrough(this.animatedTiles[map].animatedTiles);
            }
        }
    }

    postUpdate (time, delta) {
        if (!this.active) {
            return;
        }

        this.totalTime += delta;

        const globalElapsedTime = delta * this.rate * (this.followTimeScale ? this.scene!.time.timeScale : 1);

        this.animatedTiles.forEach((mapAnimData) => {
            if (!mapAnimData.active) {
                return;
            }

            const elapsedTime = globalElapsedTime * mapAnimData.rate;
            mapAnimData.animatedTiles.forEach((animatedTile) => {
                animatedTile.next -= elapsedTime * animatedTile.rate;

                if (animatedTile.next < 0) {
                    const currentIndex = animatedTile.currentFrame;
                    const oldTileId = animatedTile.frames[currentIndex].tileid;
                    let newIndex = currentIndex + 1;

                    if (newIndex > animatedTile.frames.length - 1) {
                        newIndex = 0;
                    }

                    animatedTile.next += animatedTile.frames[newIndex].duration;
                    animatedTile.currentFrame = newIndex;

                    animatedTile.tiles.forEach((layer, layerIndex) => {
                        if (!mapAnimData.activeLayer[layerIndex]) {
                            return;
                        }
                        
                        this.updateLayer(animatedTile, layer, oldTileId);
                    });
                }
            });
        });
    }

    syncNewTiles (animatedTilesData) {
        const globalElapsedTime = this.totalTime * this.rate * (this.followTimeScale ? this.scene!.time.timeScale : 1);

        animatedTilesData.animatedTiles.forEach((animatedTile) => {
            const elapsedTime = globalElapsedTime * animatedTile.rate;
            const cycleDuration = this.getAnimationDuration(animatedTile);
            
            animatedTile.next = -(elapsedTime - Math.floor(elapsedTime / cycleDuration) * cycleDuration);

            const currentIndex = animatedTile.currentFrame;
            const oldTileId = animatedTile.frames[currentIndex].tileid;

            while (animatedTile.next < 0) {
                const newIndex = (animatedTile.currentFrame + 1) % animatedTile.frames.length;

                animatedTile.next += animatedTile.frames[newIndex].duration;
                animatedTile.currentFrame = newIndex;
            }

            animatedTile.tiles.forEach((layer, layerIndex) => {
                if (!animatedTilesData.activeLayer[layerIndex]) {
                    return;
                }

                this.updateLayer(animatedTile, layer, oldTileId);
            });
        });
    }

    getAnimationDuration (animatedTile) {
        let duration = 0;

        for (const frame of animatedTile.frames) {
            duration += frame.duration;
        }

        return duration;
    }

    updateLayer (animatedTile, layer, oldTileId = -1) {
        const tilesToRemove = [] as Phaser.Tilemaps.Tile[];
        const tileId = animatedTile.frames[animatedTile.currentFrame].tileid;

        layer.forEach(function (tile) {
            if (oldTileId > -1 && (tile === null || tile.index !== oldTileId)) {
                tilesToRemove.push(tile);
            } else {
                tile.index = tileId;
            }
        });

        tilesToRemove.forEach(function (tile) {
            const pos = layer.indexOf(tile);

            if (pos > -1) {
                layer.splice(pos, 1);
            } else {
                console.error('This shouldn\'t happen. Not at all. Blame Phaser Animated Tiles plugin. You\'ll be fine though.');
            }
        });
    }

    shutdown () {
        this.scene = null;
        this.animatedTiles.length = 0;
    }

    removeMap (map) {
        const index = this.animatedTiles.findIndex(
            function (data) { return data.map === map; }
        );

        if (index === -1) {
            console.error('Removing animated tiles from the map was unsuccessful: map wasn\'t found!');
            return;
        }

        this.animatedTiles.splice(index, 1);
    }

    destroy () {
        this.shutdown();
    }

    getAnimatedTiles (map) {
        const animatedTiles = [] as any[];

        map.tilesets.forEach(function (tileset) {
            const tileData = tileset.tileData;

            Object.keys(tileData).forEach(function (i) {
                const index = parseInt(i);

                if (tileData[index].hasOwnProperty('animation')) {
                    const animatedTileData = {
                        index: index + tileset.firstgid,
                        frames: [] as any[],
                        currentFrame: 0,
                        tiles: [] as any[],
                        rate: 1,
                        next: 0
                    };

                    tileData[index].animation.forEach(function (frameData) {
                        const frame = {
                            duration: frameData.duration,
                            tileid: frameData.tileid + tileset.firstgid
                        };

                        animatedTileData.frames.push(frame);
                    });

                    animatedTileData.next = animatedTileData.frames[0].duration;
                    animatedTileData.currentFrame = animatedTileData.frames.findIndex(function (f) { return f.tileid === index + tileset.firstgid; });

                    map.layers.forEach(function (layer) {
                        if (layer.tilemapLayer && layer.tilemapLayer.type) {
                            if (layer.tilemapLayer.type === 'StaticTilemapLayer') {
                                animatedTileData.tiles.push([]);
                                return;
                            }
                        }

                        const tiles = [] as Phaser.Tilemaps.Tile[];

                        layer.data.forEach(function (tileRow) {
                            tileRow.forEach(function (tile) {
                                if (tile.index - tileset.firstgid === index) {
                                    tiles.push(tile);
                                }
                            });
                        });

                        animatedTileData.tiles.push(tiles);
                    });

                    animatedTiles.push(animatedTileData);
                }
            });
        });

        map.layers.forEach((layer, layerIndex) => {
            this.activeLayer[layerIndex] = true;
        });

        return animatedTiles;
    }

    updateAnimatedTiles () {
        const x = null,
            y = null,
            w = null,
            h = null;

        let container: any[] | null = null;

        if (container === null) {
            container = [];

            this.animatedTiles.forEach(function (mapAnimData) {
                container!.push(mapAnimData);
            });
        }

        container.forEach(function (mapAnimData) {
            const chkX = x !== null ? x : 0;
            const chkY = y !== null ? y : 0;
            const chkW = w !== null ? mapAnimData.map.width : 10;
            const chkH = h !== null ? mapAnimData.map.height : 10;

            mapAnimData.animatedTiles.forEach(function (tileAnimData) {
                tileAnimData.tiles.forEach(function (tiles, layerIndex) {
                    const layer = mapAnimData.map.layers[layerIndex];

                    if (layer.type && layer.type === 'StaticTilemapLayer') {
                        return;
                    }

                    for (let x = chkX; x < chkX + chkW; x++) {
                        for (let y = chkY; y < chkY + chkH; y++) {
                            const tile = mapAnimData.map.layers[layerIndex].data[x][y];

                            if (tile.index === tileAnimData.index) {
                                if (tiles.indexOf(tile) === -1) {
                                    tiles.push(tile);
                                }

                                tile.index = tileAnimData.frames[tileAnimData.currentFrame].tileid;
                            }
                        }
                    }
                });
            });
        });
    }

    static register (PluginManager) {
        PluginManager.register('AnimatedTiles', AnimatedTiles, 'animatedTiles');
    }
}
