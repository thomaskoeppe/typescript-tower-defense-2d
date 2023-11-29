import { LayerDepth } from "../../lib/Utils";
import GameScene from "../../scenes/GameScene";

export class HealthBar {
    public scene: GameScene;
    private bar: Phaser.GameObjects.Graphics;
    private maxHealth: number;
    private currentHealth: number;

    private hideTimeout: number;

    constructor(scene, x, y, maxHealth) {
        this.scene = scene;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;

        this.bar = this.scene.add.graphics();
        this.bar.setDepth(LayerDepth.UI_ITEM);
        this.bar.fillStyle(0x000000, 1);
        this.bar.fillRect(0, 0, 36, 12);

        this.bar.fillStyle(0x00ff00, 1);
        this.bar.fillRect(2, 2, 32, 8);

        this.setVisible(false);
        this.hideTimeout = 0;
    }

    update(x, y, health) {        
        if (health < this.currentHealth) {
            this.setVisible(true);
            this.hideTimeout = this.scene.time.now + 2000;
        }

        if (this.scene.time.now > this.hideTimeout) {
            this.setVisible(false);
        }

        this.setPosition(x, y);
        this.setHealth(health);
    }

    setPosition(x, y) {
        this.bar.setPosition(x, y);
    }

    setScale(scale: number) {
        this.bar.setScale(scale);
    }

    setHealth(health: number) {
        let color = 0x00ff00;

        if (health <= this.maxHealth * 0.75) {
            color = 0xffff00;
        }

        if (health <= this.maxHealth * 0.25) {
            color = 0xff0000;
        }

        this.bar.clear();
        this.bar.fillStyle(0x000000, 1);
        this.bar.fillRect(0, 0, 36, 12);
        this.bar.fillStyle(color, 1);
        this.bar.fillRect(2, 2, 32 * (health / this.maxHealth), 8);

        this.currentHealth = health;
    }

    destroy() {
        this.bar.destroy();
    }

    setVisible(visible: boolean) {
        this.bar.setVisible(visible);
    }
}