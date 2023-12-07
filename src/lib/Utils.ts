import { flatten } from 'lodash';
import GameScene from '../scenes/GameScene';

export enum CollisionGroup {
    BULLET = -1,
    ENEMY = -2,
    TOWER = -3,
}

export enum LayerDepth {
    GROUND = 0,
    WATER = 1,
    PATH = 2,
    ENEMY = 3,
    DECORATIONS = 4,
    ANIMATIONS = 5,
    INTERACTION = 6,
    UI = 7,
    UI_ITEM = 8,
}

export class Utils {
    public static product (arr1, arr2) {
        return flatten(arr1.map(function (e1) { return arr2.map(function (e2) { return [ e1, e2 ]; }); }));
    }

    public static createPath (p: Phaser.Curves.Path, w: Phaser.Math.Vector2[], s: Phaser.Math.Vector2, e: Phaser.Math.Vector2): Phaser.Curves.Path {
        p = new Phaser.Curves.Path(s.x, s.y);
        w.forEach(function (w2) { return p.lineTo(w2.x, w2.y); });
        p!.lineTo(e.x, e.y);

        return p;
    }

    public static parseText (m: string, v: { [key: string]: any }): string {
        return m.replace(/%\w+%/g, function (all) { return v[all.replace(/%/g, '')] || 'N/A'; });
    }

    static renderMap (s: GameScene): Phaser.Tilemaps.Tilemap {
        const w = s.make.tilemap({ key: 'tilemap' });
        const bT = w.addTilesetImage('tiles-base');
        const wT = w.addTilesetImage('tiles-water');
        const lT = w.addTilesetImage('tiles-leaves');
        const wT2 = w.addTilesetImage('tiles-wind');
        const gL = w.createLayer('Ground', [ bT! ], 0, 0);
        const wL = w.createLayer('Water', [ wT! ], 0, 0);
        const pL = w.createLayer('Path', [ bT! ], 0, 0);
        const dL = w.createLayer('Decorations', [ bT!, wT! ], 0, 0);
        const aL = w.createLayer('Animations', [ lT!, wT2! ], 0, 0);
        const iL = w.createLayer('Interaction', [ bT! ], 0, 0);

        gL!.setDepth(LayerDepth.GROUND);
        wL!.setDepth(LayerDepth.WATER);
        pL!.setDepth(LayerDepth.PATH);
        dL!.setDepth(LayerDepth.DECORATIONS);
        aL!.setDepth(LayerDepth.ANIMATIONS);
        iL!.setDepth(LayerDepth.INTERACTION);

        iL!.forEachTile(function (t: Phaser.Tilemaps.Tile) {
            if (t.index === -1) {
                t.index = 72;
            }
        });

        w.setLayer(iL!);
        w.setCollisionByProperty({ isBlocked: true });
        s.animatedTiles.init(w, [ w.getLayerIndex(aL!), w.getLayerIndex(wL!) ]);
        s.animatedTiles.setRate(0.5);

        return w;
    }
}
