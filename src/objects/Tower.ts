import { GameObjects, Math as Math2 } from 'phaser';
import GameScene from '../scenes/GameScene';
import { IEnemy } from './Enemy';
import { CollisionGroup, LayerDepth } from '../lib/Utils';
import { ButtonGroup } from './UI/ButtonGroup';

export type ITower = {
    params: TowerParams;

    update: (time, delta) => void;
    getXY: () => { x: number, y: number };
    getCenter: () => { x: number, y: number };
    getCoords: () => Phaser.Math.Vector2;
    getLevel: () => number;
    upgrade: () => void;
    isMenuShown: () => boolean;
    hideMenu: () => void;
    getMenuXY: () => { x: number, y: number };
}

export type TowerParams = {
    offsetX: number,
    offsetY: number,
    maxLevel: number,
    economy: {
        buildCost: number,
        sellPercentage: number
    },
    level: {
        [key: string]: {
            weapon: {
                sprite: string,
                shootAnim: string,
                shootFrame: number,
                offsetX: number,
                offsetY: number,
                cooldown: number,
                distance: number,
                shoot: (scene: GameScene, source: Phaser.Math.Vector2, target: Phaser.Math.Vector2) => void
            },
            sprite: string,
            upgradeCost: number,
            build: {
                sprite: string,
                frame: number,
                buildAnim: string,
                finishAnim: string,
                duration: number
            }
        }
    }
}

export abstract class AbstractTower implements ITower {
    protected scene: GameScene;
    protected sprite: Phaser.Physics.Matter.Sprite;

    public params: TowerParams;

    private lockedEnemy: IEnemy | undefined;
    private isShooting: boolean;
    private lastFired: number;
    private body: MatterJS.BodyFactory;
    private bodies: MatterJS.BodiesFactory;
    private level: number;

    private radius: GameObjects.Graphics;

    private weapon: Phaser.Physics.Matter.Sprite;

    private menu: ButtonGroup;

    private levelData: {
        weapon: {
            sprite: string,
            shootAnim: string,
            shootFrame: number,
            offsetX: number,
            offsetY: number,
            cooldown: number,
            distance: number,
            shoot: (scene: GameScene, source: Phaser.Math.Vector2, target: Phaser.Math.Vector2) => void
        },
        sprite: string,
        upgradeCost: number,
        build: {
            sprite: string,
            frame: number,
            buildAnim: string,
            finishAnim: string,
            duration: number
        }
    };

    abstract shoot({ x, y }: { x: number, y: number }): void;

    constructor (scene: GameScene, v, params: TowerParams) {
        this.scene = scene;
        this.params = params;
        this.level = 1;
        this.levelData = this.params.level[this.level.toString()];

        this.body = this.scene.matter.body;
        this.bodies = this.scene.matter.bodies;

        this.sprite = this.scene.matter.add.sprite(v.x, v.y, this.levelData.sprite, this.level.toString()).setAngle(0);
        this.weapon = this.scene.matter.add.sprite(v.x + this.levelData.weapon.offsetX, v.y + this.levelData.weapon.offsetY, this.levelData.weapon.sprite, '0').setCollisionGroup(CollisionGroup.BULLET).setAngle(0).setDepth(LayerDepth.INTERACTION);

        this.sprite.setExistingBody(this.body.create({
            parts: [ this.bodies.rectangle(0, 0, 8, 8) ],
            frictionAir: 0.0,
            friction: 0.0,
            frictionStatic: 0.0
        })).setCollisionGroup(CollisionGroup.BULLET).setDepth(LayerDepth.INTERACTION).setPosition(v.x, v.y).setAngle(0).setStatic(true);

        this.weapon.setExistingBody(this.body.create({
            parts: [ this.bodies.rectangle(0, 0, 8, 8) ],
            frictionAir: 0.0,
            friction: 0.0,
            frictionStatic: 0.0
        })).setCollisionGroup(CollisionGroup.BULLET).setDepth(LayerDepth.INTERACTION).setPosition(v.x + this.levelData.weapon.offsetX, v.y + this.levelData.weapon.offsetY).setAngle(0).setStatic(true);

        this.isShooting = false;
        this.lastFired = 0;

        this.radius = this.scene.add.graphics().lineStyle(2, 0x000000, 0.5).setAlpha(0.5).strokeCircle(this.sprite.getCenter().x!, this.sprite.getCenter().y!, this.levelData.weapon.distance).setDepth(LayerDepth.UI).setVisible(false);

        this.weapon.on('animationupdate', (anim, frame) => {

            if (!this.lockedEnemy) {
                this.isShooting = false;
                return;
            }

            if (frame.index === this.levelData.weapon.shootFrame) {
                this.levelData.weapon.shoot(this.scene, new Phaser.Math.Vector2(this.weapon.getCenter().x, this.weapon.getCenter().y), this.lockedEnemy.getCoords());
                this.isShooting = false;
            }
        });

        this.menu = new ButtonGroup(this.scene, { x: this.sprite.getCenter().x!, y: this.sprite.getCenter().y! }, { w: 100, h: 100 }, [
            {
                name: 'upgrade',
                title: 'Upgrade',
                icon: 'icons-0',
                texture: '15',
                onClick: (pointer) => {
                    if (this.hasMaxLevel()) {
                        return;
                    }

                    this.hideMenu();
                    this.upgrade();
                }
            },
            {
                name: 'sell',
                title: 'Sell',
                icon: 'icons-0',
                texture: '14',
                onClick: (pointer) => {
                    this.hideMenu();

                    // this.sell();
                }
            },
            {
                name: 'sell',
                title: 'Sell',
                icon: 'icons-0',
                texture: '13',
                onClick: (pointer) => {
                    this.hideMenu();

                    // this.sell();
                }
            }
        ]);

        this.sprite.setInteractive();
        this.sprite.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                if (this.isMenuShown()) {
                    this.hideMenu();
                } else {
                    this.showMenu();
                }
            }
        });
    }

    public update (time, delta) {
        this.lockedEnemy = this.scene.getNearestBloon(new Phaser.Math.Vector2(this.sprite.x, this.sprite.y), this.levelData.weapon.distance);

        if (this.lockedEnemy) {
            const { x: x, y: y } = this.lockedEnemy.getXY();

            this.weapon.setAngle((Math2.Angle.Between(this.sprite.x, this.sprite.y, x, y) * 180 / Math.PI) + 90);

            if (time > this.lastFired && !this.isShooting) {
                this.isShooting = true;

                this.weapon.anims.play(this.levelData.weapon.shootAnim);

                this.lastFired = time + this.levelData.weapon.cooldown;
            }
        }
    }

    getXY (): { x: number, y: number } {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }

    getCoords (): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    }

    getCenter (): { x: number, y: number } {
        return this.sprite.getCenter();
    }

    getLevel (): number {
        return this.level;
    }

    upgrade () {
        this.level++;
        this.levelData = this.params.level[this.level.toString()];

        this.sprite.setTexture(this.levelData.sprite, (this.level).toString());
    }

    hasMaxLevel (): boolean {
        return this.level === this.params.maxLevel;
    }

    isMenuShown () {
        return this.menu.isShown;
    }

    hideMenu () {
        this.menu.hide();
        this.radius.setVisible(false);
    }

    showMenu () {
        this.menu.show();
        this.radius.setVisible(true);
    }

    getMenuXY () {
        return this.menu.getXY();
    }
}
