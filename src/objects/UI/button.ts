import { LayerDepth } from '../../lib';

export class Button {
    private _buttonFrames: { default: string, hover: string, active: string, activeHover: string };
    private _active: boolean = false;

    private _button: Phaser.GameObjects.Sprite;
    private _icon: Phaser.GameObjects.Sprite;

    constructor (scene: Phaser.Scene, x: number, y: number, buttonFrames: { default: string, hover: string, active: string, activeHover: string }, icon: string) {
        this._buttonFrames = buttonFrames;
        this._icon = scene.add.existing(scene.add.sprite(x, y, 'buttons', icon)).setDepth(LayerDepth.UI_ITEM);
        this._button = scene.add.existing(scene.add.sprite(x, y, 'buttons', buttonFrames.default)).setDepth(LayerDepth.UI).setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                this._button.setFrame(this._active ? this._buttonFrames.activeHover : this._buttonFrames.hover);
            })
            .on('pointerout', () => {
                this._button.setFrame(this._active ? this._buttonFrames.active : this._buttonFrames.default);
            })
            .on('pointerdown', (p: Phaser.Input.Pointer) => {
                if (!p.leftButtonDown()) {
                    return;
                }

                this._button.setFrame(this._active ? this._buttonFrames.default : this._buttonFrames.active);
                this._active = !this._active;
            });
    }

    public setDisplaySize (width: number, height: number) {
        this._button.setDisplaySize(width, height);
        this._icon.setDisplaySize(width - width / 2, height - width / 2);

        return this;
    }

    public on (event: string, callback: (pointer: Phaser.Input.Pointer) => void) {
        this._button.on(event, callback);

        return this;
    }
}