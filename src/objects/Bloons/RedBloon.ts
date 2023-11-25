import { Bloon } from "../Bloon";

export class RedBloon extends Bloon {
    static create(scene, v) {
        return new RedBloon(scene, v, {
            hp: 1,
            speed: 1,
            reward: 1,
            takesHealth: 1,
            sprite: 'bloons-0',
            frame: '1',
            scale: 0.5,
            radius: 20,
        });
    }
}