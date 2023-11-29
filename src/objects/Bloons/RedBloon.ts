import { AbstractBloon } from "../Bloon";

export class RedBloon extends AbstractBloon {
    constructor(scene, v, params) {
        super(scene, v, params);
    }

    static create(scene, v) {
        return new RedBloon(scene, v, {
            hp: 4,
            speed: 1,
            reward: 1,
            takesHealth: 1,
            sprite: 'enemies-0',
            frame: 'd-0',
            scale: 1,
            radius: 20,
        });
    }
}