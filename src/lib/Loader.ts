import { Scene } from "phaser";

export default class Loader {
    public static loadSpritesheets(scene: Scene) {
        // == Bloons == //
        scene.load.atlas('enemies-0', './assets/sprites/enemies/7/spritesheet.png', './assets/sprites/enemies/7/spritesheet.json');
        // == Turrets == //
        scene.load.atlas('towers-0', './assets/sprites/towers/0/spritesheet.png', './assets/sprites/towers/0/spritesheet.json');

        // == Projectiles == //
        scene.load.atlas('projectiles-0', './assets/sprites/projectiles/0/spritesheet.png', './assets/sprites/projectiles/0/spritesheet.json');

        // == Effects == //
        scene.load.atlas('effects-0', './assets/sprites/effects/0/spritesheet.png', './assets/sprites/effects/0/spritesheet.json');
    }

    public static loadImages(scene: Scene) {
        // == Turret Menu Images == //
        // scene.load.image("monkey-0", "./assets/images/monkey-0.png");
    }

    public static loadTilemaps(scene: Scene) {
        // == Tilemap == //
        scene.load.image("tiles-base", "./assets/sprites/maps/base.png");
        scene.load.image("tiles-water", "./assets/sprites/maps/water.png");
        scene.load.image("tiles-leaves", "./assets/sprites/maps/leaves.png");
        scene.load.image("tiles-wind", "./assets/sprites/maps/wind.png");
        scene.load.tilemapTiledJSON("tilemap", "./assets/tilemaps/map-2.json");
    }

    public static loadWavedata(scene: Scene) {
        // == Wave Data == //
        scene.load.json("wavedata", "./config/wavedata/normal.json");
        scene.load.json("mapdata", "./config/mapdata/map-2.json")
    }

    public static loadAudio(scene: Scene) {

    }

    public static loadFonts(scene: Scene) {

    }

    public static generateAnimations(scene: Scene) {
        console.log("Generating animations...");
        console.log("walk-down frames:")
        console.log(scene.anims.generateFrameNames('enemies-0', { prefix: 'd-', start: 0, end: 23 }));

        scene.anims.create({
            key: 'enemies-0-walk-down',
            frames: scene.anims.generateFrameNames('enemies-0', { prefix: 'd-', start: 8, end: 15 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'enemies-0-walk-up',
            frames: scene.anims.generateFrameNames('enemies-0', { prefix: 'u-', start: 8, end: 15 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'enemies-0-walk-lr',
            frames: scene.anims.generateFrameNames('enemies-0', { prefix: 'lr-', start: 8, end: 15 }),
            frameRate: 8,
            repeat: -1
        });
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