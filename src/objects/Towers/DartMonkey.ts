import { IBloon } from "../Bloon";
import { Dart } from "../Projectiles/Dart";
import { AbstractTower } from "../Tower";

export class DartMonkey extends AbstractTower {
    constructor(scene, v, tv) {
        super(scene, v, {cooldown: 250, sprite: 'towers-0', maxDistance: 250});
    }

    static create(scene, v, tv) {
        return new DartMonkey(scene, v, tv)
    }

    shoot(target) {
        this.scene.spawnProjectile(Dart.create(this.scene, new Phaser.Math.Vector2(this.sprite.x + (14 * Math.cos(this.sprite.rotation+Math.PI/2)), this.sprite.y + (14 * Math.sin(this.sprite.rotation+Math.PI/2))), target)); 
    }
}