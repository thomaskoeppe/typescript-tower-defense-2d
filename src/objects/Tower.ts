import GameScene from '../scenes/GameScene';
import { CollisionGroup, LayerDepth } from '../lib';
import { ButtonGroup } from './UI/ButtonGroup';
import { TowerParams, TowerLevel } from '../types/';
import { ITower, IEnemy } from '../interfaces';
import { ProgressBar } from './UI/ProgressBar';

export abstract class AbstractTower implements ITower {
    public params: TowerParams;

    protected scene: GameScene;
    protected sprite: Phaser.Physics.Matter.Sprite;

    private lockedEnemy: IEnemy | undefined;
    private isShooting: boolean = false;
    private lastFired: number = 0;
    private body: MatterJS.BodyFactory;
    private bodies: MatterJS.BodiesFactory;
    private level: number;
    private levelData: TowerLevel;
    private radius: Phaser.GameObjects.Graphics;
    private weapon: Phaser.Physics.Matter.Sprite;
    private menu: ButtonGroup;
    private isBuilding: boolean = true;
    private costs: number = 0;
    private destroyed: boolean = false;

    constructor (scene: GameScene, v, params: TowerParams) {
        this.scene = scene;
        this.params = params;

        this.level = 1;
        this.costs = this.params.economy.buildCost;
        this.levelData = this.params.level[this.level.toString()];

        this.body = this.scene.matter.body;
        this.bodies = this.scene.matter.bodies;

        this.sprite = this.scene.matter.add.sprite(v.x, v.y, this.levelData.sprite, this.level.toString()).setAngle(0).setVisible(false);
        this.weapon = this.scene.matter.add.sprite(v.x + this.levelData.weapon.offsetX, v.y + this.levelData.weapon.offsetY, this.levelData.weapon.sprite, '0').setCollisionGroup(CollisionGroup.BULLET).setAngle(0).setDepth(LayerDepth.INTERACTION).setVisible(false);

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

                    if (this.scene.getMoney() < this.levelData.upgradeCost) {
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
                    this.sell();
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

    public build (): void {
        new Promise((resolve, reject) => {
            const buildAnimation = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.levelData.build.sprite, this.levelData.build.frame).setDepth(LayerDepth.UI);
            buildAnimation.anims.play(this.levelData.build.buildAnim);

            new ProgressBar(this.scene, this.sprite.x, this.sprite.y, this.levelData.build.duration, () => {
                const buildAnimation2 = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.levelData.build.sprite, this.levelData.build.frame).setDepth(LayerDepth.UI);
                buildAnimation2.anims.play(this.levelData.build.finishAnim);

                buildAnimation2.on('animationcomplete', () => {
                    buildAnimation.destroy();
                    buildAnimation2.destroy();

                    resolve(this);
                });
            });
        }).then(() => {
            this.sprite.setVisible(true);
            this.weapon.setVisible(true);
            this.isBuilding = false;
        });
    }

    public update (time, delta) {
        if (this.isBuilding) {
            return;
        }

        this.lockedEnemy = this.scene.getNearestBloon(new Phaser.Math.Vector2(this.sprite.x, this.sprite.y), this.levelData.weapon.distance);

        if (this.lockedEnemy) {
            const { x: x, y: y } = this.lockedEnemy.getXY();

            this.weapon.setAngle((Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, x, y) * 180 / Math.PI) + 90);

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

    isDestroyed (): boolean {
        return this.destroyed;
    }

    sell () {
        const refund = Math.floor(this.costs * this.params.economy.sellPercentage);

        const buildAnimation = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'tower-destroy-animations', '0').setDepth(LayerDepth.UI);
        buildAnimation.anims.play('tower-destroy');

        buildAnimation.on('animationupdate', (anim, frame) => {
            if (frame.index === 2) {
                this.destroyed = true;
                this.sprite.destroy();
                this.weapon.destroy();
                this.radius.destroy();
                this.menu.destroy();
            }
        });

        buildAnimation.on('animationcomplete', () => {
            buildAnimation.destroy();
            this.scene.addMoney(refund);
        });
    }

    upgrade () {
        this.level++;
        this.levelData = this.params.level[this.level.toString()];

        this.isBuilding = true;
        
        this.weapon.setVisible(false);
        this.sprite.setVisible(false);

        new Promise((resolve, reject) => {
            const buildAnimation4 = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.levelData.build.sprite, this.levelData.build.frame).setDepth(LayerDepth.UI);
            buildAnimation4.anims.play(this.levelData.build.buildAnim);

            new ProgressBar(this.scene, this.sprite.x, this.sprite.y, this.levelData.build.duration, () => {
                const buildAnimation5 = this.scene.add.sprite(this.sprite.x, this.sprite.y, this.levelData.build.sprite, this.levelData.build.frame).setDepth(LayerDepth.UI);
                buildAnimation5.anims.play(this.levelData.build.finishAnim);

                buildAnimation5.on('animationcomplete', () => {
                    buildAnimation4.destroy();
                    buildAnimation5.destroy();
                    resolve(null);
                });
            });
        }).then(() => {
            this.radius.clear().lineStyle(2, 0x000000, 0.5).setAlpha(0.5).strokeCircle(this.sprite.getCenter().x!, this.sprite.getCenter().y!, this.levelData.weapon.distance);
            this.costs += this.levelData.upgradeCost;
    
            this.sprite.setTexture(this.levelData.sprite, (this.level).toString());
            this.weapon.setTexture(this.levelData.weapon.sprite, this.levelData.weapon.frame);
            this.weapon.setPosition(this.sprite.x + this.levelData.weapon.offsetX, this.sprite.y + this.levelData.weapon.offsetY);
            this.weapon.setVisible(true);
            this.sprite.setVisible(true);

            this.isBuilding = false;
        });
    }

    hasMaxLevel (): boolean {
        return this.level === this.params.maxLevel;
    }

    // == BUTTON ACTIONS == //
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
