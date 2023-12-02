import { CanDie } from './GameObject';
import GameScene from '../scenes/GameScene';
import { CollisionGroup, LayerDepth } from '../lib/Utils';

export interface IProjectile extends CanDie {
    params: ProjectileParams;
    debugUid: string;

    onCollide: () => void;
    destroy: () => void;
    getSprite: () => Phaser.Physics.Matter.Sprite;
    setAngle: (angle: number) => void;
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
    private collided: boolean;

    private body: MatterJS.BodyFactory;
    private bodies: MatterJS.BodiesFactory;

    public params: ProjectileParams;

    public debugUid: string;
    public debugText: Phaser.GameObjects.Text;

    constructor (scene, source, target, params) {
        this.scene = scene;
        this.params = params;

        this.collided = false;

        this.body = this.scene.matter.body;
        this.bodies = this.scene.matter.bodies;

        this.sprite = this.scene.matter.add.sprite(source.x, source.y, params.sprite, params.frame);

        this.debugUid = Math.random().toString(36).substr(2, 3).toUpperCase();
        this.debugText = this.scene.add.text(source.x, source.y, this.debugUid, { fontSize: '14px', backgroundColor: '#000000' }).setDepth(LayerDepth.UI);

        this.sprite.setExistingBody(this.body.create({
            parts: [ this.bodies.rectangle(0, 0, this.sprite.width, this.sprite.height, { chamfer: { radius: this.params.radius } }) ],
            frictionAir: 0.0,
            friction: 0.0,
            frictionStatic: 0.0
        })).setCollisionGroup(CollisionGroup.BULLET).setDepth(LayerDepth.INTERACTION).setPosition(source.x, source.y).setAngle((Math.atan2(target.y - source.y, target.x - source.x) * 180 / Math.PI) + 90).setScale(this.params.scale);

        this.sprite.applyForce(new Phaser.Math.Vector2((target.x - source.x) === 0 ? 1 : target.x - source.x, (target.y - source.y) === 0 ? 1 : target.y - source.y).normalize().scale(0.01));

        this.sprite.anims.play('projectiles-0-lvl-0-shoot');

        this.scene.createProjectile(this);
    }

    getSprite () {
        return this.sprite;
    }

    getXY () {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }

    getVelXY () {
        return {
            velX: (this.sprite.body as MatterJS.BodyType).velocity.x,
            velY: (this.sprite.body as MatterJS.BodyType).velocity.y
        };
    }

    setAngle (angle) {
        this.sprite.setAngle(angle);
        return this;
    }

    isDead () {
        return this.collided;
    }

    destroy () {
        this.sprite.destroy();
        this.debugText.destroy();
    }

    update (time, delta) {
        this.debugText.setPosition(this.sprite.x, this.sprite.y);
    }

    onCollide () {
        this.collided = true;
    }
}
