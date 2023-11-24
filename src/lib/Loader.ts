import { Scene } from "phaser";

export default class Loader {
    public static loadSpritesheets(scene: Scene) {
        // == Bloons == //
        scene.load.atlas('bloons-0', './assets/sprites/bloons/0/spritesheet.png', './assets/sprites/bloons/0/spritesheet.json');
        scene.load.atlas('bloons-1', './assets/sprites/bloons/1/spritesheet.png', './assets/sprites/bloons/1/spritesheet.json');
        scene.load.atlas('bloons-2', './assets/sprites/bloons/2/spritesheet.png', './assets/sprites/bloons/2/spritesheet.json');
        scene.load.atlas('bloons-3', './assets/sprites/bloons/3/spritesheet.png', './assets/sprites/bloons/3/spritesheet.json');
        scene.load.atlas('bloons-4', './assets/sprites/bloons/4/spritesheet.png', './assets/sprites/bloons/4/spritesheet.json');

        // == Turrets == //
        scene.load.atlas('turrets-0', './assets/sprites/turrets/0/spritesheet.png', './assets/sprites/turrets/0/spritesheet.json');

        // == Projectiles == //
        scene.load.atlas('projectiles-0', './assets/sprites/projectiles/0/spritesheet.png', './assets/sprites/projectiles/0/spritesheet.json');

        // == Effects == //
        scene.load.atlas('effects-0', './assets/sprites/effects/0/spritesheet.png', './assets/sprites/effects/0/spritesheet.json');
    }

    public static loadImages(scene: Scene) {
        // == Turret Menu Images == //
        scene.load.image("monkey-0", "./assets/images/monkey-0.png");
    }

    public static loadTilemaps(scene: Scene) {
        // == Tilemap == //
        scene.load.image("tiles", "./assets/images/tiles.png");
        scene.load.tilemapTiledJSON("tilemap", "./assets/tilemaps/map-1.json");
    }

    public static loadWavedata(scene: Scene) {
        // == Wave Data == //
        scene.load.json("wavedata", "./config/wavedata/normal.json");
        scene.load.json("mapdata", "./config/mapdata/map-1.json")
    }

    public static loadAudio(scene: Scene) {

    }

    public static loadFonts(scene: Scene) {

    }

    public static initiate(scene: Scene) {
        this.loadSpritesheets(scene);
        this.loadImages(scene);
        this.loadTilemaps(scene);
        this.loadWavedata(scene);
        this.loadAudio(scene);
        this.loadFonts(scene);
    }
}