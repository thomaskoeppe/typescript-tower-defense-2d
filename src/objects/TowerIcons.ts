import { LayerDepth } from "../lib/LayerDepth";
import GameScene from "../scenes/GameScene";

export interface ITowerIcons {
    drag: (pointer: Phaser.Input.Pointer, x: number, y: number) => void;
    dragStart: () => void;
    dragEnd: (pointer: Phaser.Input.Pointer) => void;
    hasCollisions: (hasCollisions: boolean) => void;
}

export type TowerIconsParams = {
    radius: number,
    maxDistance: number,
    sprite: string
}

export abstract class AbstractTowerIcons implements ITowerIcons {
    protected params: TowerIconsParams;
    protected scene: GameScene;
    protected defaulPosition: { x: number, y: number };
    protected sprite: Phaser.GameObjects.Image;
    protected graphics: Phaser.GameObjects.Graphics;
    protected graphics2: Phaser.GameObjects.Graphics;

    constructor(scene: GameScene, params: TowerIconsParams) {
        this.scene = scene;
        this.params = params;

        this.sprite = this.scene.add.image(0, 0, this.params.sprite).setOrigin(0, 0).setInteractive().setDepth(LayerDepth.UI_ITEM);
        this.defaulPosition = { x: this.sprite.x, y: this.sprite.y };

        this.scene.hud!.add(this.sprite);
        this.scene.input.setDraggable(this.sprite);

        this.sprite.on('dragstart', () => this.dragStart());
        this.sprite.on('drag', (pointer, dragX, dragY) => this.drag(pointer, dragX, dragY));
        this.sprite.on('dragend', (pointer) => this.dragEnd(pointer));
        this.graphics = this.scene.add.graphics().setDepth(LayerDepth.INTERACTION);
        this.graphics2 = this.scene.add.graphics().setDepth(LayerDepth.INTERACTION);
        this.scene.hud!.add(this.graphics);
    }

    public dragStart() {
        this.graphics.fillStyle(0x000000);
        this.graphics.setAlpha(0.2);
        this.graphics.fillCircle(this.sprite.x, this.sprite.y, this.params.radius);

        this.graphics.lineStyle(3, 0xff0000);
        this.graphics.strokeCircle(this.sprite.x, this.sprite.y, this.params.maxDistance);

        this.graphics2.fillStyle(0x000000);
        this.graphics2.setAlpha(0.2);
        this.graphics2.fillRect(this.sprite.x, this.sprite.y, 64, 64);
    }

    public drag(pointer: Phaser.Input.Pointer, x: number, y: number) {
        const tile = this.scene.getTileAtWorldXY(pointer.worldX, pointer.worldY);

        if (tile && tile.index !== 74) {
            this.graphics2.setPosition(tile.getCenterX(), tile.getCenterY());
        }

        console.log(tile)
        
        this.sprite.setPosition(x, y);
        this.graphics.setPosition(this.sprite.getCenter().x, this.sprite.getCenter().y);

        this.hasCollisions(this.scene.checkCollision(pointer.worldX, pointer.worldY, this.params.radius));
    }

    // tile-based placement


    public dragEnd(pointer: Phaser.Input.Pointer) {
        if (Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.defaulPosition.x, this.defaulPosition.y) > 5) {
            if (this.scene.checkCollision(pointer.worldX, pointer.worldY, this.params.radius)) {
                const text = this.scene.add.text(this.scene.cameras.main.width / 2, 16, "Turret can't placed here", {
                    font: "18px monospace",
                    padding: { x: 20, y: 10 },
                    backgroundColor: "#000000"
                  }).setOrigin(0.5, 0).setDepth(LayerDepth.UI_ITEM);
            
                  setTimeout(() => {
                    text.destroy();
                  }, 2500);
            } else {
                this.scene.placeTurret(pointer)
            }
        }

        this.sprite.setPosition(this.sprite.input?.dragStartX, this.sprite.input?.dragStartY);
        this.hasCollisions(false);
        this.graphics.clear();
    }

    public hasCollisions(hasCollisions: boolean) {
        if (hasCollisions) {
            this.sprite.setTint(0xff0000);
        } else {
            this.sprite.setTint(0xffffff);
        }
    }
}