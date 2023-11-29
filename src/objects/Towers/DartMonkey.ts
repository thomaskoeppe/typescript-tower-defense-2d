import { IBloon } from "../Bloon";
import { Dart } from "../Projectiles/Dart";
import { AbstractTower } from "../Tower";

export class DartMonkey extends AbstractTower {
    constructor(scene, v, tv) {
        super(scene, v, {cooldown: 1000, sprite: 'towers-0', maxDistance: 250});
    }

    static create(scene, v, tv) {
        return new DartMonkey(scene, v, tv)
    }

    shoot(target) {
        this.scene.spawnProjectile(Dart.create(this.scene, new Phaser.Math.Vector2(this.sprite.getCenter().x, this.sprite.getCenter().y), target)); 
    }
}