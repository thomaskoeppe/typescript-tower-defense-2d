import { AbstractProjectile } from '../Projectile';

export class SingleArrow extends AbstractProjectile {
    static create (scene, source, target) {
        return new SingleArrow(scene, source, target, {
            sprite: 'projectiles-0-lvl-0',
            frame: '0',
            radius: 0,
            scale: 1,
            damage: 1
        });
    }
}
