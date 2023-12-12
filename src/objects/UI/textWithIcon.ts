import { LayerDepth } from '../../lib';

export class TextWithIcon {
    private container: Phaser.GameObjects.Container;
    private icon: Phaser.GameObjects.Sprite;
    private text: Phaser.GameObjects.Text;

    constructor (scene: Phaser.Scene, x: number, y: number, icon: string, iconFrame: string, text: string, size: number, color: number) {
        this.container = scene.add.container(x, y).setDepth(LayerDepth.UI);

        this.icon = scene.add.sprite(0, 0, icon, iconFrame).setDisplaySize(size, size).setOrigin(0, 0.5).setDepth(LayerDepth.UI_ITEM);
        this.text = scene.add.text(0, 0, text, {
            fontFamily: 'Public Pixel',
            fontSize: size / 1.5 + 'px',
            color: '#' + color.toString(16)
        }).setOrigin(0, 0.5).setPadding(42, 0, 0, 0).setDepth(LayerDepth.UI_ITEM);

        this.container.add(this.icon);
        this.container.add(this.text);
    }

    public updateText (text: string) {
        this.text.setText(text);
    }
}