export type AnimatedTile = {
    map: Phaser.Tilemaps.Tilemap,
    animatedTiles: any[],
    active: boolean,
    rate: number,
    activeLayer: boolean[]
}

export class AnimatedTiles extends Phaser.Plugins.ScenePlugin {
    public scene: Phaser.Scene | null;

    private totalTime: number;
    private animatedTiles: AnimatedTile[];
    private rate: number;
    private active: boolean;
    private activeLayer: boolean[];
    private followTimeScale: boolean;

    constructor(scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
        super(scene, pluginManager, "AnimatedTiles");

        this.scene = scene;
        this.totalTime = 0;
        this.animatedTiles = [];
        this.rate = 1;
        this.active = false;
        this.activeLayer = [];
        this.followTimeScale = true;

        if (!scene.sys.settings.isBooted) {
            scene.sys.events.once("boot", this.boot, this);
        }
    }

    public boot() {
        const eventEmitter = this.systems!.events;

        eventEmitter.on("postupdate", this.postUpdate, this);
        eventEmitter.on("shutdown", this.shutdown, this);
        eventEmitter.on("destroy", this.destroy, this);
    }

    public init(map, activeLayers: number[] = []) {
        let mapAnimData = this.getAnimatedTiles(map);
        let animatedTiles: AnimatedTile = {
            map,
            animatedTiles: mapAnimData,
            active: true,
            rate: 1,
            activeLayer: [],
        };

        map.layers.forEach((i) => {
            const index = map.layers.indexOf(i);
            animatedTiles.activeLayer.push(activeLayers.indexOf(index) > -1);
        });

        this.animatedTiles.push(animatedTiles);

        if (this.animatedTiles.length === 1) {
            this.active = true;
        }

        this.syncNewTiles(animatedTiles)
    }

    setRate(rate, gid = null, map = null) {
        if (gid === null) {
            if (map === null) {
                this.rate = rate;
            } else {
                this.animatedTiles[map].rate = rate;
            }
        } else {

            let loopThrough = (animatedTiles) => {
                animatedTiles.forEach((animatedTile) => {
                    if (animatedTile.index === gid) {
                        animatedTile.rate = rate;
                    }
                });
            };

            if (map === null) {
                this.animatedTiles.forEach((animatedTiles) => {
                    loopThrough(animatedTiles.animatedTiles);
                });
            } else {
                loopThrough(this.animatedTiles[map].animatedTiles);
            }
        }
    }

    resetRates(mapIndex = null) {
        if (mapIndex === null) {
            this.rate = 1;

            this.animatedTiles.forEach((mapAnimData) => {
                mapAnimData.rate = 1;
                mapAnimData.animatedTiles.forEach((tileAnimData) => {
                    tileAnimData.rate = 1;
                });
            });
        } else {
            this.animatedTiles[mapIndex].rate = 1;

            this.animatedTiles[mapIndex].animatedTiles.forEach(
                (tileAnimData) => {
                    tileAnimData.rate = 1;
                }
            );
        }
    }

    resume(layerIndex = null, mapIndex = null) {
        let scope;

        if (mapIndex === null) {
            scope = this;
        } else {
            scope = this.animatedTiles[mapIndex]
        }

        if (layerIndex === null) {
            scope.active = true;
        } else {
            scope.activeLayer[layerIndex] = true;
            scope.animatedTiles.forEach((animatedTile) => {
                this.updateLayer(animatedTile, animatedTile.tiles[layerIndex]);
            });
        }
    }

    pause(layerIndex = null, mapIndex = null) {
        let scope;

        if (mapIndex === null) {
            scope = this;
        } else {
            scope = this.animatedTiles[mapIndex]
        }

        if (layerIndex === null) {
            scope.active = false;
        } else {
            scope.activeLayer[layerIndex] = false;
        }
    }

    postUpdate(time, delta) {
        if (!this.active) {
            return;
        }

        this.totalTime += delta;

        let globalElapsedTime = delta * this.rate * (this.followTimeScale ? this.scene!.time.timeScale : 1);

        this.animatedTiles.forEach((mapAnimData) => {
            if (!mapAnimData.active) {
                return;
            }

            let elapsedTime = globalElapsedTime * mapAnimData.rate;
            mapAnimData.animatedTiles.forEach((animatedTile) => {
                animatedTile.next -= elapsedTime * animatedTile.rate;

                if (animatedTile.next < 0) {
                    let currentIndex = animatedTile.currentFrame;
                    let oldTileId = animatedTile.frames[currentIndex].tileid;
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

    syncNewTiles(animatedTilesData) {
        const globalElapsedTime = this.totalTime * this.rate * (this.followTimeScale ? this.scene!.time.timeScale : 1);

        animatedTilesData.animatedTiles.forEach((animatedTile) => {
            const elapsedTime = globalElapsedTime * animatedTile.rate;
            const cycleDuration = this.getAnimationDuration(animatedTile)
            
            animatedTile.next = -(elapsedTime - Math.floor(elapsedTime / cycleDuration) * cycleDuration);

            let currentIndex = animatedTile.currentFrame;
            let oldTileId = animatedTile.frames[currentIndex].tileid;

            while (animatedTile.next < 0) {
                let newIndex = (animatedTile.currentFrame + 1) % animatedTile.frames.length;

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

    getAnimationDuration(animatedTile){
        let duration = 0;

        for(const frame of animatedTile.frames){
            duration += frame.duration
        }

        return duration
    }

    updateLayer(animatedTile, layer, oldTileId = -1) {
        let tilesToRemove = [] as Phaser.Tilemaps.Tile[];
        let tileId = animatedTile.frames[animatedTile.currentFrame].tileid;

        layer.forEach((tile) => {
            if (oldTileId > -1 && (tile === null || tile.index !== oldTileId)) {
                tilesToRemove.push(tile);
            } else {
                tile.index = tileId;
            }
        });

        tilesToRemove.forEach((tile) => {
            let pos = layer.indexOf(tile);

            if (pos > -1) {
                layer.splice(pos, 1);
            } else {
                console.error("This shouldn't happen. Not at all. Blame Phaser Animated Tiles plugin. You'll be fine though.");
            }
        });
    }

    shutdown() {
        this.scene = null;
        this.animatedTiles.length = 0;
    }

    removeMap(map) {
        const index = this.animatedTiles.findIndex(
            (data) => data.map === map
        );

        if (index === -1) {
            console.error("Removing animated tiles from the map was unsuccessful: map wasn't found!")
            return
        };

        this.animatedTiles.splice(index, 1)
    }

    destroy() {
        this.shutdown();
    }

    getAnimatedTiles(map) {
        let animatedTiles = [] as any[];

        map.tilesets.forEach((tileset) => {
            let tileData = tileset.tileData;

            Object.keys(tileData).forEach((i) => {
                const index = parseInt(i);

                if (tileData[index].hasOwnProperty("animation")) {
                    let animatedTileData = {
                        index: index + tileset.firstgid,
                        frames: [] as any[],
                        currentFrame: 0,
                        tiles: [] as any[],
                        rate: 1,
                        next: 0,
                    };

                    tileData[index].animation.forEach((frameData) => {
                        let frame = {
                            duration: frameData.duration,
                            tileid: frameData.tileid + tileset.firstgid,
                        };

                        animatedTileData.frames.push(frame);
                    });

                    animatedTileData.next = animatedTileData.frames[0].duration;
                    animatedTileData.currentFrame = animatedTileData.frames.findIndex((f) => f.tileid === index + tileset.firstgid);

                    map.layers.forEach((layer) => {
                        if (layer.tilemapLayer && layer.tilemapLayer.type) {
                            if (layer.tilemapLayer.type === "StaticTilemapLayer") {
                                animatedTileData.tiles.push([]);
                                return;
                            }
                        }

                        let tiles = [] as Phaser.Tilemaps.Tile[];

                        layer.data.forEach((tileRow) => {
                            tileRow.forEach((tile) => {
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

    updateAnimatedTiles() {
        let x = null, y = null, w = null, h = null, container: any[] | null = null;
        if (container === null) {
            container = [];

            this.animatedTiles.forEach((mapAnimData) => {
                container!.push(mapAnimData);
            });
        }

        container.forEach((mapAnimData) => {
            let chkX = x !== null ? x : 0;
            let chkY = y !== null ? y : 0;
            let chkW = w !== null ? mapAnimData.map.width : 10;
            let chkH = h !== null ? mapAnimData.map.height : 10;

            mapAnimData.animatedTiles.forEach((tileAnimData) => {
                tileAnimData.tiles.forEach((tiles, layerIndex) => {
                    let layer = mapAnimData.map.layers[layerIndex];

                    if (layer.type && layer.type === "StaticTilemapLayer") {
                        return;
                    }

                    for (let x = chkX; x < chkX + chkW; x++) {
                        for (let y = chkY; y < chkY + chkH; y++) {
                            let tile = mapAnimData.map.layers[layerIndex].data[x][y];

                            if (tile.index == tileAnimData.index) {
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

    static register(PluginManager) {
        PluginManager.register("AnimatedTiles", AnimatedTiles, "animatedTiles");
    }
}