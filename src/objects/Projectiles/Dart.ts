import { AbstractProjectile } from "../Projectile";

export class Dart extends AbstractProjectile {
    static create(scene, {x, y}, {dirX, dirY}, params) {
        params.sprite = 'projectiles-0';
        params.frame = '1';
        params.radius = 20;

        return new Dart(scene, {x, y}, {dirX, dirY}, params);
    }

    clone(pos, dir, angle) {
        return Dart.create(this.scene, pos, dir, this.params).setAngle(angle)
    }
}