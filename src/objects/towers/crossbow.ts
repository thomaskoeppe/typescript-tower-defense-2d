import { SingleArrow, DoubleArrow, TripleArrow } from '../projectiles';
import { AbstractTower } from '../Tower';
import { LayerDepth } from '../../lib';
import { TowerParams } from '../../types';
import { ProgressBar } from '../UI/ProgressBar';

export class CrossBow extends AbstractTower {
    public static readonly config: TowerParams = {
        offsetX: 32,
        offsetY: 0,
        maxLevel: 3,
        economy: {
            buildCost: 100,
            sellPercentage: 0.8
        },
        level: {
            1: {
                weapon: {
                    sprite: 'weapons-0-lvl-0',
                    frame: 0,
                    shootAnim: 'weapons-0-lvl-0-shoot',
                    shootFrame: 2,
                    offsetX: 0,
                    offsetY: -8,
                    cooldown: 1000,
                    distance: 250,
                    shoot: function (scene, source, target) {
                        scene.spawnProjectile(SingleArrow.create(scene, source, target));
                    }
                },
                sprite: 'towers-0',
                frame: 0,
                upgradeCost: 0,
                build: {
                    sprite: 'tower-animations',
                    frame: 0,
                    buildAnim: 'tower-build-0',
                    finishAnim: 'tower-build-0-finish',
                    duration: 5000
                }
            },
            2: {
                weapon: {
                    sprite: 'weapons-0-lvl-1',
                    frame: 0,
                    shootAnim: 'weapons-0-lvl-1-shoot',
                    shootFrame: 2,
                    offsetX: 0,
                    offsetY: -24,
                    cooldown: 1500,
                    distance: 350,
                    shoot: function (scene, source, target) {
                        scene.spawnProjectile(DoubleArrow.create(scene, source, target));
                    }
                },
                sprite: 'towers-0',
                frame: 1,
                upgradeCost: 100,
                build: {
                    sprite: 'tower-animations',
                    frame: 1,
                    buildAnim: 'tower-build-1',
                    startAnim: 'tower-build-1-start',
                    finishAnim: 'tower-build-1-finish',
                    duration: 10000
                }
            },
            3: {
                weapon: {
                    sprite: 'weapons-0-lvl-2',
                    frame: 0,
                    shootAnim: 'weapons-0-lvl-2-shoot',
                    shootFrame: 2,
                    offsetX: 0,
                    offsetY: -32,
                    cooldown: 2000,
                    distance: 500,
                    shoot: function (scene, source, target) {
                        scene.spawnProjectile(TripleArrow.create(scene, source, target));
                    }
                },
                sprite: 'towers-0',
                frame: 1,
                upgradeCost: 250,
                build: {
                    sprite: 'tower-animations',
                    frame: 1,
                    buildAnim: 'tower-build-2',
                    startAnim: 'tower-build-2-start',
                    finishAnim: 'tower-build-2-finish',
                    duration: 15000
                }
            }
        }
    };

    constructor (scene, v) {
        super(scene, v, CrossBow.config);
    }

    static create (scene, v): AbstractTower {
        return new CrossBow(scene, v);
    }
}
