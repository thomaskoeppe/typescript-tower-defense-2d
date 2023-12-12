export class Loader {
    public static loadSpritesheets (scene: Phaser.Scene) {
        // == Enemies == //
        scene.load.atlas('enemies-7', './assets/sprites/enemies/7/spritesheet.png', './assets/sprites/enemies/7/spritesheet.json');
        scene.load.atlas('enemies-5', './assets/sprites/enemies/5/spritesheet.png', './assets/sprites/enemies/5/spritesheet.json');

        // == Towers == //
        scene.load.atlas('towers-0', './assets/sprites/towers/0/spritesheet.png', './assets/sprites/towers/0/spritesheet.json');
        scene.load.atlas('towers-2', './assets/sprites/towers/2/spritesheet.png', './assets/sprites/towers/2/spritesheet.json');

        // == Projectiles == //
        scene.load.atlas('projectiles-0-lvl-0', './assets/sprites/projectiles/0/spritesheet-0.png', './assets/sprites/projectiles/0/spritesheet-0.json');
        scene.load.atlas('projectiles-0-lvl-1', './assets/sprites/projectiles/0/spritesheet-1.png', './assets/sprites/projectiles/0/spritesheet-1.json');
        scene.load.atlas('projectiles-0-lvl-2', './assets/sprites/projectiles/0/spritesheet-2.png', './assets/sprites/projectiles/0/spritesheet-2.json');

        // == Weapons == //
        scene.load.atlas('weapons-0-lvl-0', './assets/sprites/weapons/0/spritesheet-0.png', './assets/sprites/weapons/0/spritesheet-0.json');
        scene.load.atlas('weapons-0-lvl-1', './assets/sprites/weapons/0/spritesheet-1.png', './assets/sprites/weapons/0/spritesheet-1.json');
        scene.load.atlas('weapons-0-lvl-2', './assets/sprites/weapons/0/spritesheet-2.png', './assets/sprites/weapons/0/spritesheet-2.json');
    
        scene.load.atlas('weapons-2-lvl-0', './assets/sprites/weapons/2/spritesheet-0.png', './assets/sprites/weapons/2/spritesheet-0.json');

        // == Effects == //
        scene.load.atlas('effects-0', './assets/sprites/effects/0/spritesheet.png', './assets/sprites/effects/0/spritesheet.json');

        // == Animations == //
        scene.load.atlas('tower-destroy-animations', './assets/sprites/anims/0/spritesheet.png', './assets/sprites/anims/0/spritesheet.json');
        scene.load.atlas('tower-animations', './assets/sprites/anims/1/spritesheet.png', './assets/sprites/anims/1/spritesheet.json');
    }

    public static loadImages (scene: Phaser.Scene) {
        // == Turret Menu Images == //
        // scene.load.image("monkey-0", "./assets/images/monkey-0.png");
    }

    public static loadTilemaps (scene: Phaser.Scene) {
        // == Tilemap == //
        scene.load.image('tiles-base', './assets/sprites/maps/base.png');
        scene.load.image('tiles-water', './assets/sprites/maps/water.png');
        scene.load.image('tiles-leaves', './assets/sprites/maps/leaves.png');
        scene.load.image('tiles-wind', './assets/sprites/maps/wind.png');
        scene.load.tilemapTiledJSON('tilemap', './assets/tilemaps/map-2.json');
    }

    public static loadWavedata (scene: Phaser.Scene) {
        // == Wave Data == //
        scene.load.json('wavedata', './config/wavedata/normal.json');
        scene.load.json('mapdata', './config/mapdata/map-2.json');
    }

    public static loadAudio (scene: Phaser.Scene) {

    }

    public static loadFonts (scene: Phaser.Scene) {
        scene.load.bitmapFont('carrier-command', './assets/fonts/carrier_command.png', './assets/fonts/carrier_command.xml');
    }

    public static loadIcons (scene: Phaser.Scene) {
        scene.load.atlas('icons-0', './assets/icons/spritesheet-0.png', './assets/icons/spritesheet-0.json');
        scene.load.atlas('icons-1', './assets/icons/spritesheet-1.png', './assets/icons/spritesheet-1.json');
        scene.load.atlas('icons-2', './assets/icons/spritesheet-2.png', './assets/icons/spritesheet-2.json');
    }

    public static generateAnimations (scene: Phaser.Scene) {
        scene.anims.create({
            key: 'enemies-7-walk-down',
            frames: scene.anims.generateFrameNames('enemies-7', { prefix: 'd-', start: 8, end: 15 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'enemies-7-walk-up',
            frames: scene.anims.generateFrameNames('enemies-7', { prefix: 'u-', start: 8, end: 15 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'enemies-7-walk-lr',
            frames: scene.anims.generateFrameNames('enemies-7', { prefix: 'lr-', start: 8, end: 15 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'enemies-5-walk-down',
            frames: scene.anims.generateFrameNames('enemies-5', { prefix: 'd-', start: 8, end: 15 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'enemies-5-walk-up',
            frames: scene.anims.generateFrameNames('enemies-5', { prefix: 'u-', start: 8, end: 15 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'enemies-5-walk-lr',
            frames: scene.anims.generateFrameNames('enemies-5', { prefix: 'lr-', start: 8, end: 15 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'weapons-0-lvl-0-shoot',
            frames: scene.anims.generateFrameNames('weapons-0-lvl-0', { frames: [ 1, 2, 3, 4, 5, 0 ]}),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: 'weapons-2-lvl-0-shoot',
            frames: scene.anims.generateFrameNames('weapons-2-lvl-0', { frames: [ 1, 2, 3, 4, 5, 6, 7, 0 ]}),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: 'projectiles-0-lvl-0-shoot',
            frames: scene.anims.generateFrameNames('projectiles-0-lvl-0', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'projectiles-0-hit',
            frames: scene.anims.generateFrameNames('effects-0', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: 'weapons-0-lvl-1-shoot',
            frames: scene.anims.generateFrameNames('weapons-0-lvl-1', { frames: [ 1, 2, 3, 4, 5, 0 ]}),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: 'projectiles-0-lvl-1-shoot',
            frames: scene.anims.generateFrameNames('projectiles-0-lvl-1', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'weapons-0-lvl-2-shoot',
            frames: scene.anims.generateFrameNames('weapons-0-lvl-2', { frames: [ 1, 2, 3, 4, 5, 0 ]}),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: 'projectiles-0-lvl-2-shoot',
            frames: scene.anims.generateFrameNames('projectiles-0-lvl-2', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'tower-build-0',
            frames: scene.anims.generateFrameNames('tower-animations', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'tower-build-0-finish',
            frames: scene.anims.generateFrameNames('tower-animations', { start: 35, end: 30 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: 'tower-build-1',
            frames: scene.anims.generateFrameNames('tower-animations', { start: 12, end: 17 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'tower-build-1-start',
            frames: scene.anims.generateFrameNames('tower-animations', { start: 35, end: 30 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: 'tower-build-1-finish',
            frames: scene.anims.generateFrameNames('tower-animations', { start: 11, end: 6 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: 'tower-build-2',
            frames: scene.anims.generateFrameNames('tower-animations', { start: 24, end: 29 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'tower-build-2-start',
            frames: scene.anims.generateFrameNames('tower-animations', { start: 18, end: 23 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: 'tower-build-2-finish',
            frames: scene.anims.generateFrameNames('tower-animations', { start: 11, end: 6 }),
            frameRate: 8,
            repeat: 0
        });

        scene.anims.create({
            key: 'tower-destroy',
            frames: scene.anims.generateFrameNames('tower-destroy-animations', { start: 0, end: 12 }),
            frameRate: 8,
            repeat: 0
        });
    }

    public static initiate (scene: Phaser.Scene) {
        this.loadSpritesheets(scene);
        this.loadImages(scene);
        this.loadIcons(scene);
        this.loadTilemaps(scene);
        this.loadWavedata(scene);
        this.loadAudio(scene);
        this.loadFonts(scene);
    }
}
