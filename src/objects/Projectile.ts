import { CanDie } from './GameObject';
import GameScene, { CollisionGroup } from '../scenes/GameScene';

export interface Projectile extends CanDie {
    params: ProjectileParams
    destroy: () => void
    getSprite: () => Phaser.Physics.Matter.Sprite
    setAngle: (angle: number) => void
    onCollide: () => void
}

export type ProjectileParams = {
    scale: { x: number, y: number },
    damage: number,
    frictionAir: number,
    mass: number
}

export default class Dart implements Projectile {
    protected scene: GameScene;
    protected sprite: Phaser.Physics.Matter.Sprite;
    private collided: boolean = false;

    private body: MatterJS.BodyFactory;
    private bodies: MatterJS.BodiesFactory;

    public params: ProjectileParams;

    constructor(scene, {x, y}, {dirX, dirY}, params) {
        this.scene = scene;
        this.params = params;

        this.body = this.scene.matter.body;
        this.bodies = this.scene.matter.bodies;

        const { scale: { x: scaleX, y: scaleY } } = params;
        const sprite = this.scene.matter.add.sprite(x, y, 'projectiles-0', '1');

        sprite.setExistingBody(this.bodies.rectangle(0, 0, sprite.width, sprite.height, { chamfer: { radius: 20 } }))
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

    public static create(scene, pos, dir, params) {
        return new Dart(scene, pos, dir, params);
    }

    getSprite() {
        return this.sprite
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
        this.sprite.setAngle(angle)
        return this
    }

    isDead() {
        return this.collided
    }

    destroy() {
        this.sprite.destroy()
    }

    update(delta) {
        if(Math.abs((this.sprite.body as MatterJS.BodyType).velocity.x) <= 0.001 && Math.abs((this.sprite.body as MatterJS.BodyType).velocity.x) <= 0.001){
            this.collided = true
        }
    }

    onCollide() {
        this.collided = true;
    }
}