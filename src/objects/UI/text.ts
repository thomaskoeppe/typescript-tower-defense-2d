import { LayerDepth } from '../../lib';

export class Text {
    private container: Phaser.GameObjects.Container;
    private text: Phaser.GameObjects.Text;

    constructor (scene: Phaser.Scene, x: number, y: number, text: string, size: number, color: number) {
        this.container = scene.add.container(x, y).setDepth(LayerDepth.UI);

        this.text = scene.add.text(0, 0, text, {
            fontFamily: 'Public Pixel',
            fontSize: size / 1.5 + 'px',
            color: '#' + color.toString(16)
        }).setOrigin(0, 0.5).setDepth(LayerDepth.UI_ITEM);

        this.container.add(this.text);
        this.container.setSize(this.text.width, this.text.height);
    }

    public updateText (text: string) {
        this.text.setText(text);
        this.container.setSize(this.text.width, this.text.height);
    }

    public destroy () {
        this.container.destroy();
        this.text.destroy();
    }

    get width () {
        return this.container.width;
    }

    get height () {
        return this.container.height;
    }

    get x () {
        return this.container.x;
    }

    get y () {
        return this.container.y;
    }

    public setPosition (x: number, y: number) {
        this.container.setPosition(x, y);
    }
}