import { LayerDepth } from '../../lib';
import GameScene from '../../scenes/GameScene';

export type Button = {
    name: string,
    title: string,
    icon: string,
    texture: string,

    sprite?: Phaser.GameObjects.Sprite,
    border?: Phaser.GameObjects.Sprite,

    onClick: (pointer) => void
}

export class ButtonGroup extends Phaser.GameObjects.Container {
    public scene: GameScene;

    private buttons: Button[];

    constructor (scene: GameScene, {x: x, y: y}: {x: number, y: number}, {w: w, h: h}: {w: number, h: number}, buttons: Button[]) {
        super(scene, x, y + 48);

        this.scene = scene;
        this.buttons = buttons;

        this.scene.add.existing(this);

        this.setDepth(LayerDepth.UI);

        let width = 0;
        this.buttons.forEach((button, index) => {
            button.sprite = this.scene.add.sprite(index * 32 + index * 16, 0, button.icon, button.texture).setOrigin(0, 0).setDepth(LayerDepth.UI_ITEM).setDisplaySize(32, 32);
            button.border = this.scene.add.sprite(index * 32 + index * 16 - 8, -8, 'icons-1', '0').setOrigin(0, 0).setDepth(LayerDepth.UI_ITEM).setDisplaySize(48, 48);
            width += index > 0 ? button.sprite.width + 16 : button.sprite.width;
            
            button.sprite.setInteractive();
            button.sprite.on('pointerdown', function (pointer: Phaser.Input.Pointer) {
                if (pointer.leftButtonDown() || pointer.leftButtonReleased()) {
                    button.onClick(pointer);
                }
            });

            button.sprite.on('pointerover', function (pointer: Phaser.Input.Pointer) {
                button.sprite!.setAlpha(0.75);
                button.border!.setAlpha(0.75);
            });

            button.sprite.on('pointerout', function (pointer: Phaser.Input.Pointer) {
                button.sprite!.setAlpha(1);
                button.border!.setAlpha(1);
            });

            this.add(button.sprite);
            this.add(button.border);
        });

        this.x -= width / 2;

        this.hide();
    }

    public show () {
        this.setVisible(true);
    }

    public hide () {
        this.setVisible(false);
    }

    get isShown () {
        return this.visible;
    }

    getXY () {
        return {x: this.x, y: this.y};
    }

    getButtons () {
        return this.buttons;
    }

    getSize () {
        return {w: this.width, h: this.height};
    }
}
