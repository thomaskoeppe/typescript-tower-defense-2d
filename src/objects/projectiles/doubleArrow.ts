import { AbstractProjectile } from '../Projectile';

export class DoubleArrow extends AbstractProjectile {
    static create (scene, source, target) {
        return new DoubleArrow(scene, source, target, {
            sprite: 'projectiles-0-lvl-0',
            frame: '0',
            radius: 0,
            scale: 1,
            damage: 1
        });
    }
}
