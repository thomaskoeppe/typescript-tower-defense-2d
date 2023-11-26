import { CanDie } from './GameObject';
import GameScene, { CollisionGroup } from '../scenes/GameScene';

export interface IProjectile extends CanDie {
    params: ProjectileParams;

    destroy: () => void;
    getSprite: () => Phaser.Physics.Matter.Sprite;
    setAngle: (angle: number) => void;
    onCollide: (collision) => void;
}

export type ProjectileParams = {
    scale: number,
    damage: number,
    radius: number,
    sprite: string,
    frame: string
}

export abstract class AbstractProjectile implements IProjectile {
    protected scene: GameScene;
    protected sprite: Phaser.Physics.Matter.Sprite;
    private collided: boolean = false;

    private body: MatterJS.BodyFactory;
    private bodies: MatterJS.BodiesFactory;

    public params: ProjectileParams;

    constructor(scene, source, target, params) {
        this.scene = scene;
        this.params = params;

        this.body = this.scene.matter.body;
        this.bodies = this.scene.matter.bodies;

        this.sprite = this.scene.matter.add.sprite(source.x, source.y, params.sprite, params.frame);

        this.sprite.setExistingBody(this.body.create({
            parts: [this.bodies.rectangle(0, 0, this.sprite.width, this.sprite.height, { chamfer: { radius: this.params.radius } })],
            frictionAir: 0.0,
            friction: 0.0,
            frictionStatic: 0.0,
        })).setCollisionGroup(CollisionGroup.BULLET).setPosition(source.x, source.y).setAngle(Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI).setScale(this.params.scale);

        this.sprite.thrust(0.005);

        this.scene.matterCollision.addOnCollideStart({
            objectA: this.sprite,
            callback: this.onCollide,
            context: this
        });
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
        if(Math.abs((this.sprite.body as MatterJS.BodyType).velocity.x) <= 0.001 && Math.abs((this.sprite.body as MatterJS.BodyType).velocity.x) <= 0.001) {
            this.collided = true;
        }
    }

    onCollide(collision) {
        this.collided = true;
    }
}