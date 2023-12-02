import { AbstractEnemy, EnemyParams } from '../Enemy';

export class Larvae extends AbstractEnemy {
    constructor (scene, v, params: EnemyParams) {
        super(scene, v, params);
    }

    static create (scene, v) {
        return new Larvae(scene, v, {
            hp: 10,
            speed: 0.5,
            reward: 1,
            takesHealth: 1,
            sprite: 'enemies-5',
            canFly: false,
            frame: 'd-0',
            scale: 1,
            body: {
                width: 24,
                height: 48,
                radius: 10,
                rotation: {
                    right: {
                        angle: 80
                    },
                    down: {
                        angle: 0
                    },
                    up: {
                        angle: 0
                    },
                    left: {
                        angle: -80,
                        flipY: true
                    }
                }
            },
            animSet: {
                'walk-down': 'enemies-5-walk-down',
                'walk-up': 'enemies-5-walk-up',
                'walk-lr': 'enemies-5-walk-lr'
            }
        });
    }
}
