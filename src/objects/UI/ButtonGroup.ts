import { LayerDepth } from '../../lib';
import GameScene from '../../scenes/GameScene';

export type Button = {
    name: string,
    title: string,
    icon: string,
    needsBorder?: boolean,
    texture: string,

    sprite?: Phaser.GameObjects.Sprite,
    border?: Phaser.GameObjects.Sprite,

    onClick: (pointer) => void
}

export class ButtonGroup extends Phaser.GameObjects.Container {
    public scene: GameScene;

    private buttons: Button[];
    private tooltip: Phaser.GameObjects.Text;

    constructor (scene: GameScene, {x: x, y: y}: {x: number, y: number}, {w: w, h: h}: {w: number, h: number}, buttons: Button[]) {
        super(scene, x, y + 48);

        this.scene = scene;
        this.buttons = buttons;

        this.tooltip = this.scene.add.text(0, 0, '', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff', align: 'center' }).setOrigin(0.5, 0.5).setDepth(LayerDepth.UI_ITEM).setVisible(false);

        this.scene.add.existing(this);

        this.setDepth(LayerDepth.UI);

        let width = 0;
        this.buttons.forEach((button, index) => {
            button.sprite = this.scene.add.sprite(index * 32 + index * 16, 0, button.icon, button.texture).setOrigin(0, 0).setDepth(LayerDepth.UI_ITEM).setDisplaySize(32, 32);
            
            if (button.needsBorder) {
                button.border = this.scene.add.sprite(index * 32 + index * 16 - 8, -8, 'icons-1', '0').setOrigin(0, 0).setDepth(LayerDepth.UI_ITEM).setDisplaySize(48, 48);
            }

            width += index > 0 ? 48 : 32;
            
            button.sprite.setInteractive();
            button.sprite.on('pointerdown', function (pointer: Phaser.Input.Pointer) {
                if (pointer.leftButtonDown() || pointer.leftButtonReleased()) {
                    button.onClick(pointer);
                }
            });

            button.sprite.on('pointerover', () => {
                button.sprite!.setAlpha(0.75);
                button.border?.setAlpha(0.75);

                this.tooltip.setText(button.title);
                this.tooltip.setPosition(this.x + button.sprite!.x + 16, this.y + button.sprite!.y + 48);
                this.tooltip.setVisible(true);
            });

            button.sprite.on('pointerout', () => {
                button.sprite!.setAlpha(1);
                button.border?.setAlpha(1);

                this.tooltip.setVisible(false);
            });

            this.add(button.sprite);

            if (button.needsBorder && button.border) {
                this.add(button.border);
            }
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
