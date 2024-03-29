import { AbstractEnemy } from '../objects/Enemy';
import { Scorpion, Larvae } from '../objects/enemies';
import { AbstractProjectile, IProjectile } from '../objects/Projectile';
import { CrossbowIcon, CatapultIcon } from '../objects/icons';
import { Loader, AutoRemoveList, LayerDepth, Utils } from '../lib';
import { AbstractTower } from '../objects/Tower';
import { IEnemy } from '../interfaces';
import { TextWithIcon, Frame, Text, Button } from '../objects/UI';

export type PlacedTurret = {
  sprite: AbstractTower,
  tile: Phaser.Tilemaps.Tile
}

export default class GameScene extends Phaser.Scene {
    private spawn: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
    private goal: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;

    private mapdata: any;

    private wave: number = 1;
    private waveData: any;
    private money: number = 1000;
    public enemiesLeft: number = 0;
    private enemiesSpawned: number = 0;
    private nextEnemy: number = 0;
    private lastEnemy: string = 'scorpion';

    // private text: Phaser.GameObjects.Text | undefined;

    private lifes: number = 1;

    private path: Phaser.Curves.Path | undefined;
    private world: Phaser.Tilemaps.Tilemap | undefined;

    public hud: Phaser.GameObjects.Container | undefined;

    public enemies: AutoRemoveList<IEnemy>;
    public projectiles: AutoRemoveList<IProjectile>;
    public turrets: PlacedTurret[];

    private moneyText: TextWithIcon | undefined;
    private healthText: TextWithIcon | undefined;
    private waveText: Text | undefined;

    constructor () {
        super({ key: 'game', active: true, visible: true });

        this.enemies = new AutoRemoveList<IEnemy>();
        this.projectiles = new AutoRemoveList<IProjectile>();
        this.turrets = [];
    }

    public preload () {
        Loader.initiate(this);
    }

    public create () {
        this.world = Utils.renderMap(this);

        this.mapdata = this.cache.json.get('mapdata');
        this.matter.world.setBounds(0, 0, this.world.widthInPixels, this.world.heightInPixels);

        this.spawn = new Phaser.Math.Vector2(this.mapdata.spawn.x, this.mapdata.spawn.y);
        this.goal = new Phaser.Math.Vector2(this.mapdata.goal.x, this.mapdata.goal.y);
        this.path = Utils.createPath(this.path!, this.mapdata.path, this.spawn, this.goal);

        // this.text = this.add.text(16, 16, `Wave ${this.wave + 1}/${this.cache.json.get('wavedata').length}`, { fontFamily: 'Public Pixel', fontSize: 16, color: '#ffffff', backgroundColor: '#000000', lineSpacing: 8, padding: {y: 4, x: 4} }).setDepth(LayerDepth.UI);

        this.hud = this.add.container(this.cameras.main.width - 64, 512).setDepth(LayerDepth.UI);
        const backgroundColor = this.add.graphics();
        backgroundColor.fillStyle(0x000000, 1);
        backgroundColor.fillRect(0, 0, 64, 256);
        this.hud.add(backgroundColor);

        Loader.generateAnimations(this);

        CrossbowIcon.create(this, { x: 0, y: 0});
        CatapultIcon.create(this, { x: 0, y: 128});

    this.input.mouse!.disableContextMenu();
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (pointer.leftButtonDown()) {
            this.turrets.forEach((v: PlacedTurret) => {
                if (!v.sprite.isMenuShown()) {
                    return;
                }

                const { x, y } = pointer;
                const { x: mx, y: my } = v.sprite.getMenuXY();

                if (Phaser.Math.Distance.Between(x, y, mx, my) > 144) {
                    v.sprite.hideMenu();
                }
            });
        }
    });
    
    this.events.emit('updateHealth', this.lifes);
    this.events.emit('updateMoney', this.money);
    this.events.emit('updateWave', this.wave);

    // this.waveData = this.cache.json.get("wavedata")[this.wave];
    // this.enemiesLeft = this.waveData.enemies.length;
    }

    public update (time: number, delta: number): void {
        // if (this.text) {
        //     this.text.setText(`Wave ${this.wave + 1}/${this.cache.json.get('wavedata').length}\nMoney $${this.money}\nLifes ${this.lifes}`);
        // }

        if (this.enemies.active < 20 && this.nextEnemy < time) {
            let enemy;

            if (this.lastEnemy === 'scorpion') {
                enemy = Larvae.create(this, {
                    x: this.spawn.x,
                    y: this.spawn.y
                });

                this.lastEnemy = 'larvae';
            } else {
                enemy = Scorpion.create(this, {
                    x: this.spawn.x,
                    y: this.spawn.y
                });

                this.lastEnemy = 'scorpion';
            }

            enemy.startOnPath(this.path);

            this.nextEnemy = time + 2000;
        }

        // if (this.enemiesLeft === 0 && this.enemies!.countActive() === 0) {
        //   this.wave++;

        //   if (this.wave === this.cache.json.get("wavedata").length) {
        //     this.scene.stop("game");
        //     this.scene.start("gameover");
        //     return;
        //   }

        //   this.waveData = this.cache.json.get("wavedata")[this.wave];
        //   this.enemiesLeft = this.waveData.enemies.length;
        //   this.enemiesSpawned = 0;
        // }

        // if (this.nextEnemy < time && this.enemiesSpawned < this.waveData.enemies.length) {
        //   const e = this.waveData.enemies[this.enemiesSpawned];
        //   const enemy = this.enemies!.get();

        //   if (enemy) {
        //     enemy.setActive(true);
        //     enemy.setVisible(true);
        //     enemy.startOnPath(this.path);
        //     enemy.setFrame("1");
        //     enemy.setTexture(`bloons-${e.type}`);
        //     enemy.setDisplaySize(64, 64);
        //     enemy.body.setSize(enemy.width*0.5, enemy.height*0.5);
        //     enemy.setHp(e.hp);
        //     enemy.setSpeed(e.movementSpeed);
        //     enemy.setReward(e.reward);
        //     enemy.setTakesHealth(e.takesHealth);

        //     this.nextEnemy = time + 200;
        //     this.enemiesSpawned++;
        //   }
        // }

        this.enemies.update(time, delta);
        this.projectiles.update(time, delta);

        for (let i = 0; i < this.turrets.length; i++) {
            const turret = this.turrets[i];

            if (turret.sprite.isDestroyed()) {
                this.turrets.splice(i, 1);
                i--;
            } else {
                turret.sprite.update(time, delta);
            }
        }

        // this.turrets.forEach(({ sprite }) => {
        //     if (sprite.isDestroyed()) {
        //         this.turrets.splice(this.turrets.indexOf(sprite), 1);
        //     }

        //     sprite.update(time, delta);
        // });
    }

    public createEnemy (enemy: AbstractEnemy) {
        this.enemies.add(enemy);

        this.projectiles.forEach((projectile: AbstractProjectile) => {
            return this.matterCollision.addOnCollideStart({
                objectA: projectile.getSprite(),
                objectB: enemy.getSprite(),
                context: this,
                callback: (collision) => {
                    const { gameObjectB } = collision;

                    if (gameObjectB instanceof Phaser.Physics.Matter.Sprite) {
                        const { x, y } = gameObjectB as Phaser.Physics.Matter.Sprite;

                        enemy.getHit(projectile.params.damage);
            
                        this.removeProjectile(projectile);

                        const explosion = this.add.sprite(x, y, 'effects-0', '0').setDepth(LayerDepth.INTERACTION);
                        explosion.anims.play('projectiles-0-hit');
                        explosion.on('animationcomplete', () => {
                            explosion.destroy();
                        });
                    }
                }
            });
        });
    }

    public createProjectile (projectile: AbstractProjectile) {
        this.projectiles.add(projectile);

        this.enemies.forEach((enemy: AbstractEnemy) => {
            return this.matterCollision.addOnCollideStart({
                objectA: projectile.getSprite(),
                objectB: enemy.getSprite(),
                context: this,
                callback: (collision) => {
                    const { gameObjectB } = collision;

                    if (gameObjectB instanceof Phaser.Physics.Matter.Sprite) {
                        const { x, y } = gameObjectB as Phaser.Physics.Matter.Sprite;

                        enemy.getHit(projectile.params.damage);
            
                        this.removeProjectile(projectile);

                        const explosion = this.add.sprite(x, y, 'effects-0', '0').setDepth(LayerDepth.INTERACTION);
                        explosion.anims.play('projectiles-0-hit');
                        explosion.on('animationcomplete', () => {
                            explosion.destroy();
                        });
                    }
                }
            });
        });
    }

    public removeProjectile (projectile: IProjectile) {
        this.matterCollision.removeOnCollideStart({
            objectA: projectile.getSprite()
        });

        this.projectiles.remove(projectile);
        projectile.onCollide();
        projectile.destroy();
    }

    public loseHealth (takesHealth) {
        this.lifes -= takesHealth;

        this.events.emit('updateHealth', this.lifes);

        if (this.lifes <= 0) {
            this.scene.pause('game');

            this.add.graphics().fillStyle(0x0b0b0b).fillRect(0, this.cameras.main.centerY - 192, this.cameras.main.width, 256).setDepth(LayerDepth.UI);
            this.add.text(this.cameras.main.centerX - 64, this.cameras.main.centerY - 64, 'Game Over', {
                fontFamily: 'Public Pixel',
                fontSize: 128,
                color: '#ffffff',
                padding: { x: 16, y: 16 }
            }).setDepth(LayerDepth.UI).setOrigin(0.5, 0.5);
        }
    }

    public getNearestBloon (pos: Phaser.Math.Vector2, maxDistance: number): IEnemy | undefined {
        let nearestEnemy: IEnemy | undefined;
        let nearestDistance: number = maxDistance;

        this.enemies.forEach((enemy: IEnemy) => {
            if (!enemy.isDead()) {
                const { x, y } = enemy.getXY();

                const distance = Phaser.Math.Distance.Between(pos.x, pos.y, x, y);
                if (distance < nearestDistance) {
                    nearestEnemy = enemy;
                    nearestDistance = distance;
                }
            }
        });

        return nearestEnemy;
    }

    public addMoney (money: number) {
        this.money += money;

        this.events.emit('updateMoney', this.money);
    }

    public removeMoney (money: number) {
        this.money -= money;

        this.events.emit('updateMoney', this.money);
    }

    public getMoney (): number {
        return this.money;
    }

    // public removeLife(lifes) {
    //   this.lifes -= lifes;

    //   if (this.lifes <= 0) {
    //     this.scene.stop("game");
    //     this.scene.start("gameover");
    //   }
    // }

    // public addMoney(money) {
    //   this.money += money;
    // }

    public spawnProjectile (projectile: IProjectile) {
        this.projectiles.add(projectile);
    }

    public checkCollision (tile: Phaser.Tilemaps.Tile, offsetY): boolean {
        const tile2 = this.world!.getTileAt(tile.x, tile.y - 1);

        if (tile.collides) {
            return true;
        }

        if (this.turrets.some((v: PlacedTurret) => {
            const v2 = this.world!.getTileAt(v.tile.x, v.tile.y - 1);

            return v2 === tile || v2 === tile2 || v.tile === tile || v.tile === tile2;
        })) {
            return true;
        }

        return false;
    }

    public getTileAtWorldXY (x: number, y: number): Phaser.Tilemaps.Tile | null {
        return this.world!.getTileAtWorldXY(x, y);
    }
}
