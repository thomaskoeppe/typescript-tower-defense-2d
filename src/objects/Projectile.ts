import { CanDie } from './GameObject';
import GameScene, { CollisionGroup } from '../scenes/GameScene';

export interface IProjectile extends CanDie {
    params: ProjectileParams;

    destroy: () => void;
    getSprite: () => Phaser.Physics.Matter.Sprite;
    setAngle: (angle: number) => void;
    clone: (pos, dir, angle) => IProjectile;
    onCollide: () => void;
}

export type ProjectileParams = {
    scale: { x: number, y: number },
    damage: number,
    frictionAir: number,
    mass: number,
    radius: number,
    sprite: string,
    frame: string
}

export abstract class AbstractProjectile implements IProjectile {
    protected scene: GameScene;
    protected sprite: Phaser.Physics.Matter.Sprite;
    private collided: boolean = false;

    private bodies: MatterJS.BodiesFactory;

    public params: ProjectileParams;

    constructor(scene, {x, y}, {dirX, dirY}, params) {
        this.scene = scene;
        this.params = params;

        this.bodies = this.scene.matter.bodies;

        const { scale: { x: scaleX, y: scaleY } } = params;
        const sprite = this.scene.matter.add.sprite(x, y, params.sprite, params.frame);

        sprite.setExistingBody(this.bodies.rectangle(0, 0, sprite.width, sprite.height, { chamfer: { radius: params.radius } }))
            .setScale(scaleX, scaleY)
            .setVelocity(dirX * 30, dirY * 30)
            .setMass(params.mass)
            .setFrictionAir(params.frictionAir)
            .setCollisionGroup(CollisionGroup.BULLET);

        this.sprite = sprite;
        this.scene.matterCollision.addOnCollideStart({
            objectA: sprite,
            callback: this.onCollide,
            context: this
        });

        // this.setDisplaySize(24*1.5, 10*1.5);
        // this.height = 10*1.5;
        // this.width = 24*1.5;
    }

    clone(pos, dir, angle){
        return {} as any
    }

    getSprite() {
        return this.sprite;
    }

    getXY() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        }
    }

    getVelXY() {
        return {
            velX: (this.sprite.body as MatterJS.BodyType).velocity.x,
            velY: (this.sprite.body as MatterJS.BodyType).velocity.y
        }
    }

    setAngle(angle){
        this.sprite.setAngle(angle);
        return this;
    }

    isDead() {
        return this.collided;
    }

    destroy() {
        this.sprite.destroy();
    }

    update(time, delta) {
        if(Math.abs((this.sprite.body as MatterJS.BodyType).velocity.x) <= 0.001 && Math.abs((this.sprite.body as MatterJS.BodyType).velocity.x) <= 0.001){
            this.collided = true;
        }
    }

    onCollide() {
        this.collided = true;
    }
}

export { Dart } from './Projectiles/Dart';