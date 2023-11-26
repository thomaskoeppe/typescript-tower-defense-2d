import { AbstractProjectile } from "../Projectile";

export class Dart extends AbstractProjectile {
    static create(scene, source, target) {
        return new Dart(scene, source, target, {
            sprite: 'projectiles-0',
            frame: '1',
            radius: 20,
            scale: 1.5,
            damage: 1
        });
    }
}