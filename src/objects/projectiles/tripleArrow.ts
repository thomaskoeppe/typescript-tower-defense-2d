import { AbstractProjectile } from '../Projectile';

export class TripleArrow extends AbstractProjectile {
    static create (scene, source, target) {
        return new TripleArrow(scene, source, target, {
            sprite: 'projectiles-0-lvl-2',
            frame: '0',
            radius: 0,
            scale: 1,
            damage: 3,
            speed: 0.02
        });
    }
}
