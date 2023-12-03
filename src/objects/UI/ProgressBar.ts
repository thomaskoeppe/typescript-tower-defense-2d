import GameScene from '../../scenes/GameScene';
import { LayerDepth } from '../../lib';

export class ProgressBar {
    public scene: GameScene;

    private frame: Phaser.GameObjects.Graphics;
    private bar: Phaser.GameObjects.Graphics;

    constructor (scene: GameScene, x: number, y: number, time: number, callback: () => void) {
        this.scene = scene;

        x -= 26;
        y += 72;

        this.bar = this.scene.add.graphics();
        this.frame = this.scene.add.graphics();

        this.frame.setDepth(LayerDepth.UI);
        this.frame.fillStyle(0x000000, 1);
        this.frame.fillRect(0, 0, 52, 12);

        this.bar.setDepth(LayerDepth.UI_ITEM);
        this.bar.fillStyle(0xffffff, 1);
        this.bar.fillRect(2, 2, 48, 8);

        this.frame.setPosition(x, y);
        this.frame.setScale(1);
        this.bar.setPosition(x, y);
        this.bar.setScale(0, 1);

        this.scene.tweens.add({
            targets: this.bar,
            scaleX: 1,
            ease: 'Linear',
            duration: time,
            onComplete: () => {
                callback();
                this.frame.destroy();
                this.bar.destroy();
            }
        });
    }
}
