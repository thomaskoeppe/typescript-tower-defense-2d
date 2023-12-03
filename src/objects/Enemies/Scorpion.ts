import { AbstractEnemy } from '../Enemy';
import { EnemyParams } from '../../types';

export class Scorpion extends AbstractEnemy {
    constructor (scene, v, params: EnemyParams) {
        super(scene, v, params);
    }

    static create (scene, v) {
        return new Scorpion(scene, v, {
            hp: 4,
            speed: 1,
            reward: 1,
            takesHealth: 1,
            sprite: 'enemies-7',
            canFly: false,
            frame: 'd-0',
            scale: 1,
            body: {
                width: 40,
                height: 56,
                radius: 20,
                rotation: {
                    right: {
                        angle: 80,
                        flipX: true
                    },
                    down: {
                        angle: 0
                    },
                    up: {
                        angle: 0
                    },
                    left: {
                        angle: -80,
                        flipY: true,
                        flipX: true
                    }
                }
            },
            animSet: {
                'walk-down': 'enemies-7-walk-down',
                'walk-up': 'enemies-7-walk-up',
                'walk-lr': 'enemies-7-walk-lr'
            }
        });
    }
}
