import { AbstractBloon } from "../Bloon";

export class Scorpion extends AbstractBloon {
    constructor(scene, v, params) {
        super(scene, v, params);
    }

    static create(scene, v) {
        return new Scorpion(scene, v, {
            hp: 4,
            speed: 1,
            reward: 1,
            takesHealth: 1,
            sprite: 'enemies-7',
            canFly: false,
            frame: 'd-0',
            scale: 1,
            radius: 20,
            flipX: true,
            animSet: {
                "walk-down": "enemies-7-walk-down",
                "walk-up": "enemies-7-walk-up",
                "walk-lr": "enemies-7-walk-lr"
            }
        });
    }
}