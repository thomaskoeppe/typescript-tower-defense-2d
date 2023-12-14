export class Button extends Phaser.GameObjects.Sprite {
    private _frames: { default: string, hover: string };

    constructor (scene: Phaser.Scene, x: number, y: number, texture: string, frames: { default: string, hover: string }) {
        super(scene, x, y, texture, frames.default);
        this._frames = frames;
        
        this.setInteractive({ useHandCursor: true })
            .on('pointerover', this.onPointerOver)
            .on('pointerout', this.onPointerOut);

        scene.add.existing(this);
    }

    private onPointerOver (pointer: Phaser.Input.Pointer) {
        this.setFrame(this._frames.hover);
    }

    private onPointerOut (pointer: Phaser.Input.Pointer) {
        this.setFrame(this._frames.default);
    }
}