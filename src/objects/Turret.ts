import { Curves, GameObjects, Math } from "phaser";
import Enemy from "./Enemy";
import Projectile from "./Projectile";

export default class Turret extends GameObjects.Sprite {
    private maxDistance: number = 200;
    private fireRate: number = 12;

    private projectiles: Phaser.Physics.Arcade.Group;

    private lockedEnemy: Enemy = null;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, 'turrets-0', '0001');

        this.anims.create({
            key: 'turrets-0-shoot',
            frames: this.anims.generateFrameNames('turrets-0', { prefix: '000', start: 2, end: 11 }),
            frameRate: this.fireRate,
            repeat: -1
        });

        this.anims.create({
            key: 'turrets-0-idle',
            frames: this.anims.generateFrameNames('turrets-0', { prefix: '000', start: 1, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.projectiles = this.scene.physics.add.group({ classType: Projectile, runChildUpdate: true });

        this.setDisplaySize(64, 64);
        this.height = 64;
        this.width = 64;
    }

    public update(time, delta, enemies) {
        if (this.lockedEnemy) {
            this.anims.play('turrets-0-shoot', true);
            
            
        } else {
            this.anims.play('turrets-0-idle', true);
        }
    }

    public findNearestEnemy(enemies) {
        if (!enemies) {
            this.lockedEnemy = null;
            return;
        }

        let nearestEnemy: Enemy = null;
        let minDistance = Infinity;

        enemies.forEach((enemy) => {
            const distance = Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        });

        if (nearestEnemy && minDistance <= this.maxDistance) {
            this.setRotation(Math.Angle.Between(this.x, this.y, nearestEnemy.x, nearestEnemy.y));
            this.lockedEnemy = nearestEnemy;
        } else {
            this.lockedEnemy = null;
        }
    }
}