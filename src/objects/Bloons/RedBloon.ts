import { AbstractBloon } from "../Bloon";

export class RedBloon extends AbstractBloon {
    constructor(scene, v, params) {
        console.log('Creating RedBloon')
        super(scene, v, params);
    }

    static create(scene, v) {
        console.log('Creating RedBloon create')
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