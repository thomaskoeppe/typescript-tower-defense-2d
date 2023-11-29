import { AbstractProjectile } from "../Projectile";

export class Dart extends AbstractProjectile {
    static create(scene, source, target) {
        return new Dart(scene, source, target, {
            sprite: 'projectiles-0-lvl-0',
            frame: '0',
            radius: 0,
            scale: 1,
            damage: 1
        });
    }
}