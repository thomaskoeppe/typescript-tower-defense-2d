import { GameObjects, Math as Math2 } from "phaser";
import GameScene from "../scenes/GameScene";
import { IBloon } from "./Bloon";
import { IProjectile } from "./Projectile";
import { CollisionGroup, LayerDepth } from '../lib/Utils';

export type ITower = {
    params: TowerParams;

    update: (time, delta) => void;
    getXY: () => { x: number, y: number };
    getCenter: () => { x: number, y: number };
    getCoords: () => Phaser.Math.Vector2;
    getLevel: () => number;
    upgrade: () => void
}

export type TowerParams = {
    cooldown: number,
    sprite: string,
    maxDistance: number,
}

export abstract class AbstractTower implements ITower {
    protected scene: GameScene;
    protected sprite: Phaser.Physics.Matter.Sprite;

    public params: TowerParams;

    private lockedEnemy: IBloon | undefined;
    private isShooting: boolean;
    private lastFired: number;

    private level: number = 1;

    private debugGraphics: GameObjects.Graphics;

    private weapon: Phaser.Physics.Matter.Sprite;

    abstract shoot({ x, y }: { x: number, y: number }): void;

    constructor(scene: GameScene, v, params: TowerParams) {
        this.scene = scene;
        this.params = params;
        this.sprite = this.scene.matter.add.sprite(v.x+32, v.y, this.params.sprite, this.level.toString()).setCollisionGroup(CollisionGroup.BULLET).setAngle(0).setDepth(LayerDepth.INTERACTION);
        this.weapon = this.scene.matter.add.sprite(v.x+32, v.y-8, 'weapons-0-lvl-0', '0').setCollisionGroup(CollisionGroup.BULLET).setAngle(0).setDepth(LayerDepth.INTERACTION);
        
        this.sprite.setStatic(true);
        this.weapon.setStatic(true);

        this.isShooting = false;
        this.lastFired = 0;

        this.debugGraphics = this.scene.add.graphics();
    }

    public update(time, delta) {
        this.debugGraphics.clear();
        this.debugGraphics.lineStyle(1, 0x00ff00);
        this.debugGraphics.strokeCircle(this.sprite.x, this.sprite.y, this.params.maxDistance);
        this.debugGraphics.setDepth(LayerDepth.INTERACTION);

        this.lockedEnemy = this.scene.getNearestBloon(new Phaser.Math.Vector2(this.sprite.x, this.sprite.y), this.params.maxDistance);

        if (this.lockedEnemy) {
            const { x, y } = this.lockedEnemy.getXY();

            this.weapon.setAngle((Math2.Angle.Between(this.sprite.x, this.sprite.y, x, y) * 180 / Math.PI)+90);

            if (time > this.lastFired && !this.isShooting) {
                this.isShooting = true;

                this.weapon.anims.play('weapons-0-lvl-0-shoot');

                this.weapon.on("animationupdate", (anim, frame) => {
                    if (frame.index == 3 && this.lockedEnemy) {
                        this.shoot(this.lockedEnemy.getCoords());
                        this.isShooting = false;
                    }
                });

                // this.shoot(this.lockedEnemy.getCoords());
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

    getCoords(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    }

    getCenter(): { x: number, y: number } {
        return this.sprite.getCenter();
    }

    getLevel(): number {
        return this.level;
    }
    
    upgrade() {
        // TODO: Build animation and update texture, weapon & stats
        this.sprite.setTexture((this.level+1).toString());
    }
}