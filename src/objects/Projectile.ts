import { Curves, GameObjects, Math } from "phaser";

export default class Projectile extends GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, 'projectiles-0', '0001');

        this.setDisplaySize(64, 64);
        this.height = 64;
        this.width = 64;
    }

    public update(time, delta) {
    }

    public setRotation(rotation) {
        this.rotation = rotation;
        return this;
    }

    public setVelocity(x, y) {
        this.body.velocity.x = x;
        this.body.velocity.y = y;
        return this;
    }
}