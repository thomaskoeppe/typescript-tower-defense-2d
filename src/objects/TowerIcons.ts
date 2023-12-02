import { LayerDepth } from '../lib/Utils';
import GameScene from '../scenes/GameScene';

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
    protected defaultPosition: { x: number, y: number };
    protected sprite: Phaser.GameObjects.Image;
    protected graphics: Phaser.GameObjects.Graphics;

    constructor (scene: GameScene, params: TowerIconsParams) {
        this.scene = scene;
        this.params = params;

        this.sprite = this.scene.add.sprite(0, 0, 'towers-0', '1').setOrigin(0, 0).setInteractive().setDepth(LayerDepth.UI_ITEM);
        this.defaultPosition = { x: this.sprite.x, y: this.sprite.y };

        this.scene.hud!.add(this.sprite);
        this.scene.input.setDraggable(this.sprite);

        this.sprite.on('dragstart', () => { return this.dragStart(); });
        this.sprite.on('drag', (pointer, dragX, dragY) => { return this.drag(pointer, dragX, dragY); });
        this.sprite.on('dragend', (pointer) => { return this.dragEnd(pointer); });
        this.graphics = this.scene.add.graphics().setDepth(LayerDepth.INTERACTION);
    }

    public dragStart () {
        this.sprite.setAlpha(0.85);

        this.graphics.fillStyle(0x000000);
        this.graphics.setAlpha(0.2);
        this.graphics.fillRect(this.sprite.x, this.sprite.y, 64, 64);

        this.graphics.lineStyle(3, 0x000000);
        this.graphics.strokeCircle(this.sprite.x + 32, this.sprite.y + 32, this.params.maxDistance);
    }

    public drag (pointer: Phaser.Input.Pointer, x: number, y: number) {
        const tile = this.scene.getTileAtWorldXY(pointer.worldX, pointer.worldY);

        if (tile && tile.index !== 74) {
            this.graphics.setPosition(tile.x * 64, tile.y * 64).setDepth(LayerDepth.INTERACTION);
        } else {
            this.graphics.setDepth(-1);
        }
        
        this.sprite.setPosition(x, y);

        this.hasCollisions(this.scene.checkCollision(tile!));
    }


    public dragEnd (pointer: Phaser.Input.Pointer) {
        const tile = this.scene.getTileAtWorldXY(pointer.worldX, pointer.worldY);

        if (Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.defaultPosition.x, this.defaultPosition.y) > 5) {
            if (tile && !this.scene.checkCollision(tile) && tile.index !== 74) {
                this.scene.placeTurret(tile);
            }
        }

        this.sprite.setAlpha(1);
        this.sprite.setPosition(this.sprite.input?.dragStartX, this.sprite.input?.dragStartY);
        this.hasCollisions(false);
        this.graphics.clear();
    }

    public hasCollisions (hasCollisions: boolean) {
        if (hasCollisions) {
            this.sprite.setTint(0xff0000);
        } else {
            this.sprite.setTint(0xffffff);
        }
    }
}
