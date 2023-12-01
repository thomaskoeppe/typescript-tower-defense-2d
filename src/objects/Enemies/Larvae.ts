import { AbstractBloon } from "../Bloon";

export class Larvae extends AbstractBloon {
    constructor(scene, v, params) {
        super(scene, v, params);
    }

    static create(scene, v) {
        return new Larvae(scene, v, {
            hp: 10,
            speed: 0.5,
            reward: 1,
            takesHealth: 1,
            sprite: 'enemies-5',
            canFly: false,
            frame: 'd-0',
            scale: 1,
            radius: 20,
            animSet: {
                "walk-down": "enemies-5-walk-down",
                "walk-up": "enemies-5-walk-up",
                "walk-lr": "enemies-5-walk-lr"
            }
        });
    }
}