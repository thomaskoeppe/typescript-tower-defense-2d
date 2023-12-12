import { LayerDepth } from '../../lib';

export class Frame {

    private container: Phaser.GameObjects.Container;
    private sprites: Phaser.GameObjects.Sprite[] = [];

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, frames: string[][], size: number) {
        this.container = scene.add.container(x, y).setDepth(LayerDepth.UI);

        for (let i = 0; i < frames.length; i++) {
            for (let j = 0; j < frames[i].length; j++) {
                const sprite = scene.add.sprite(j * size, i * size, texture, frames[i][j]).setOrigin(0, 0).setDisplaySize(size, size).setDepth(LayerDepth.UI_ITEM);

                this.sprites.push(sprite);
                this.container.add(sprite);
            }
        }
    }
}