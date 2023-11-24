import { Curves, GameObjects, Math as Math2, Physics } from "phaser";
import GameScene, { CollisionGroup } from "../scenes/GameScene";
import Projectile from "./Projectile";
import Enemy from "./Bloon";
import { Vector } from "matter";

export type TurretParams = {
    cooldown: number,
    sprite: string,
}

export default class Turret {
    protected scene: GameScene;
    protected sprite: Phaser.Physics.Matter.Sprite;

    private params: TurretParams;
    private cooldown: number;

    private maxDistance: number = 500;
    private lastFired: number = 0;

    private debugGraphics: GameObjects.Graphics;

    private lockedEnemy: Enemy | undefined;

    constructor(scene, v, params) {
        this.scene = scene;
        this.params = params;
        this.cooldown = 0;

        this.sprite = this.scene.matter.add.sprite(v.x, v.y, this.params.sprite, '1').setCollisionGroup(CollisionGroup.BULLET).setAngle(0);

        this.debugGraphics = this.scene.add.graphics();
    }

    public static create(scene, v, params) {
        return new Turret(scene, v, params);
    }

    public update(time, delta) {
        this.debugGraphics.clear();
        this.debugGraphics.lineStyle(1, 0x00ff00);
        this.debugGraphics.strokeCircle(this.sprite.x, this.sprite.y, this.maxDistance);

        this.lockedEnemy = this.scene.getNearestBloon(new Phaser.Math.Vector2(this.sprite.x, this.sprite.y), this.maxDistance);

        if (this.lockedEnemy) {
            const { x, y } = this.lockedEnemy.getXY();
            this.sprite.setAngle(Math2.Angle.Between(this.sprite.x, this.sprite.y, x, y) * 180 / Math.PI);

            this.debugGraphics.lineBetween(this.sprite.x, this.sprite.y, x, y);

            if (time > this.lastFired) {
                // this.scene.spawnProjectile();

                //TODO: abstract class is for definition only, not for implementation. use export class DartMonkey extends Turret. same for bullet and enemy

                this.lastFired = time + 500;
            }
        }
    }

    getXY() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        }
    }

    getCenter() {
        return this.sprite.getCenter
    }
}