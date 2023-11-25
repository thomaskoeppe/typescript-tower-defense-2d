import { Dart } from "../Projectile";
import { AbstractTower } from "../Tower";

export class DartMonkey extends AbstractTower {
    constructor(scene, v, tv) {
        super(scene, v, {cooldown: 500, sprite: 'machine_gun', texture: '1', maxDistance: 200});

        this.projectileProto = Dart.create(this.scene, v, tv, {
            damage: 1,
            scale: {x: 0.7, y: 0.7},
            frictionAir: 0,
            mass: 0.005
        });
    }

    static create(scene, v, tv) {
        return new DartMonkey(scene, v, tv)
    }

    generateProjectiles(dirX, dirY) {
        const {x, y} = this.getXY()
        const spriteAngle360 = this.sprite.angle < 0 ? 360 + this.sprite.angle : this.sprite.angle

        if (this.projectileProto === undefined) {
            console.warn('Projectile prototype is undefined')
            return
        }

        this.scene.spawnProjectile(this.projectileProto.clone(
            {
                x: x + Math.cos((450 - (spriteAngle360 - 50)) / 180 * Math.PI) * 10,
                y: y - Math.sin((450 - (spriteAngle360 - 50)) / 180 * Math.PI) * 10,
            },
            {
                dirX: dirX / 10,
                dirY: dirY / 10
            }, this.sprite.angle)
        )
    }
}