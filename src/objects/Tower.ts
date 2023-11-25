import { GameObjects, Math as Math2 } from "phaser";
import GameScene, { CollisionGroup } from "../scenes/GameScene";
import { Bloon } from "./Bloon";
import { Dart, IProjectile } from "./Projectile";

export type ITower = {
    params: TowerParams;

    update: (time, delta) => void;
    getXY: () => { x: number, y: number };
    getCenter: () => { x: number, y: number };
}

export type TowerParams = {
    cooldown: number,
    sprite: string,
    texture: string,
    maxDistance: number,
}

export abstract class AbstractTower implements ITower {
    protected scene: GameScene;
    protected sprite: Phaser.Physics.Matter.Sprite;

    public params: TowerParams;

    private lockedEnemy: Bloon | undefined;
    private lastFired: number;

    public projectileProto: IProjectile | undefined;

    private debugGraphics: GameObjects.Graphics;

    abstract generateProjectiles(dirX: number, dirY: number): void

    constructor(scene: GameScene, v, params: TowerParams) {
        this.scene = scene;
        this.params = params;
        this.sprite = this.scene.matter.add.sprite(v.x, v.y, this.params.sprite, this.params.texture).setCollisionGroup(CollisionGroup.BULLET).setAngle(0);
        this.lastFired = 0;

        this.debugGraphics = this.scene.add.graphics();
    }

    public update(time, delta) {
        this.debugGraphics.clear();
        this.debugGraphics.lineStyle(1, 0x00ff00);
        this.debugGraphics.strokeCircle(this.sprite.x, this.sprite.y, this.params.maxDistance);

        this.lockedEnemy = this.scene.getNearestBloon(new Phaser.Math.Vector2(this.sprite.x, this.sprite.y), this.params.maxDistance);

        if (this.lockedEnemy) {
            const { x, y } = this.lockedEnemy.getXY();
            this.sprite.setAngle(Math2.Angle.Between(this.sprite.x, this.sprite.y, x, y) * 180 / Math.PI);

            this.debugGraphics.lineBetween(this.sprite.x, this.sprite.y, x, y);

            if (time > this.lastFired) {
                const spriteAngle360 = this.sprite.angle < 0 ? 360 + this.sprite.angle : this.sprite.angle;
                const {dirX, dirY} = {
                    dirX: Math.cos((450 - spriteAngle360) % 360 / 180 * Math.PI),
                    dirY: Math.sin((450 - spriteAngle360) % 360 / 180 * Math.PI)
                }

                this.generateProjectiles(dirX, dirY);
                this.lastFired = time + this.params.cooldown;
            }
        }
    }

    getXY(): { x: number, y: number } {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }

    getCenter(): { x: number, y: number } {
        return this.sprite.getCenter();
    }
}

export { DartMonkey } from "./Towers/DartMonkey";