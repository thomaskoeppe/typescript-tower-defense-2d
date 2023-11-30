import { LayerDepth } from "../../lib/Utils";
import GameScene from "../../scenes/GameScene"

export type ButtonGroupOptions = {
    
}

export type Button = {
    name: string,
    title: string,
    image: string,
    onClick: (pointer) => void
}

export class ButtonGroup extends Phaser.GameObjects.Container {
    public scene: GameScene;

    private buttons: Button[];
    private buttonGroup: any;

    constructor(scene: GameScene, {x, y}: {x: number, y: number}, {w, h}: {w: number, h: number}, buttons: Button[], options: ButtonGroupOptions) {
        super(scene, x, y+32);

        this.scene = scene;
        this.buttons = buttons;

        this.scene.add.existing(this);

        this.setDepth(LayerDepth.UI)

        let width = 0;
        this.buttons.forEach((button, index) => {
            let buttonSprite = this.scene.add.sprite(index * 32 + index * 16, 0, button.image).setOrigin(0, 0);
            width += index > 0 ? buttonSprite.width + 16 : buttonSprite.width;
            
            buttonSprite.setInteractive();
            buttonSprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
                if (pointer.leftButtonDown() || pointer.leftButtonReleased()) {
                    button.onClick(pointer);
                }
            });

            buttonSprite.setDepth(LayerDepth.UI_ITEM);

            this.add(buttonSprite);
        });

        this.x -= width/2;

        this.hide();
    }

    public show() {
        this.setVisible(true);
    }

    public hide() {
        this.setVisible(false);
    }

    get isShown() {
        return this.visible;
    }
}