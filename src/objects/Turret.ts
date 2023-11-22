import { Curves, GameObjects, Math as Math2 } from "phaser";
import GameScene from "../scenes/GameScene";
import Enemy from "./Enemy";

export default class Turret extends GameObjects.Sprite {
    public scene: GameScene;

    private maxDistance: number = 200;
    private lastFired: number = 0;

    private lockedEnemy: Enemy = null;

    constructor(scene: GameScene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, 'turrets-0', '1');

        this.scene = scene;
        this.setDisplaySize(64, 64);
        this.height = 64;
        this.width = 64;
    }

    public update(time, delta) {
        this.findNearestEnemy();

        if (this.lockedEnemy && time > this.lastFired) {
            this.fire();
            this.lastFired = time + 500;
        }
    }

    public fire() {
        const projectile = this.scene.projectiles.get();

        if (projectile) {
            projectile.setActive(true);
            projectile.setVisible(true);
            projectile.setPosition(this.x + (24 * Math.cos(this.rotation+Math.PI/2)), this.y + (24 * Math.sin(this.rotation+Math.PI/2)));
            projectile.setRotation(this.rotation);

            this.scene.physics.moveToObject(projectile, this.lockedEnemy, 500);
        } 
    }

    public findNearestEnemy() {
        if (!this.scene.enemies.children.entries.length) {
            this.lockedEnemy = null;
            return;
        }

        let nearestEnemy: Enemy = null;
        let minDistance = Infinity;

        this.scene.enemies.children.entries.forEach((enemy: Enemy) => {
            const distance = Math2.Distance.Between(this.x, this.y, enemy.x, enemy.y);
            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        });

        if (nearestEnemy && minDistance <= this.maxDistance && nearestEnemy.active) {
            this.setRotation(Math2.Angle.Between(this.x, this.y, nearestEnemy.x, nearestEnemy.y));
            
            this.lockedEnemy = nearestEnemy;
        } else {
            this.lockedEnemy = null;
        }

        console.log(this.lockedEnemy)
    }
}