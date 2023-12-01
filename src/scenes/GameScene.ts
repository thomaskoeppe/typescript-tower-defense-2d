import { IBloon } from "../objects/Bloon";
import { Scorpion } from "../objects/Enemies/Scorpion";
import { ITower } from "../objects/Tower";
import { CrossBowTower } from "../objects/Towers/CrossBowTower";
import Loader from "../lib/Loader";
import AutoRemoveList from "../lib/AutoRemoveList";
import { IProjectile } from "~/objects/Projectile";
import { DartMonkeyIcon } from "../objects/TowerIcons/DartMonkey";
import { LayerDepth, Utils } from "../lib/Utils";
import { Larvae } from "../objects/Enemies/Larvae";

export type PlacedTurret = {
  sprite: ITower,
  tile: Phaser.Tilemaps.Tile
}

export default class GameScene extends Phaser.Scene {
  private spawn: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
  private goal: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;

  private mapdata: any;

  private wave: number = 0;
  private waveData: any;
  public enemiesLeft: number = 0;
  private enemiesSpawned: number = 0;
  private nextEnemy: number = 0;
  private lastEnemy: string = "scorpion";

  private text: Phaser.GameObjects.Text | undefined;

  private money: number = 0;
  private lifes: number = 10;

  private path: Phaser.Curves.Path | undefined;
  private world: Phaser.Tilemaps.Tilemap | undefined;

  public hud: Phaser.GameObjects.Container | undefined;

  public enemies: AutoRemoveList<IBloon>;
  public projectiles: AutoRemoveList<IProjectile>;
  public turrets: PlacedTurret[];

  private projectileSubscriptions: (() => void)[];

  constructor() {
    super({ key: "game", active: true, visible: true });

    this.enemies = new AutoRemoveList<IBloon>();
    this.projectiles = new AutoRemoveList<IProjectile>();
    this.turrets = [];
    this.projectileSubscriptions = [];
  }

  public preload() {
    Loader.initiate(this);
  }

  public create() {
    this.world = Utils.renderMap(this);

    this.mapdata = this.cache.json.get("mapdata");
    this.matter.world.setBounds(0, 0, this.world.widthInPixels, this.world.heightInPixels);

    this.spawn = new Phaser.Math.Vector2(this.mapdata.spawn.x, this.mapdata.spawn.y);
    this.goal = new Phaser.Math.Vector2(this.mapdata.goal.x, this.mapdata.goal.y);
    this.path = Utils.createPath(this.path!, this.mapdata.path, this.spawn, this.goal);

    this.text = this.add.text(16, 16, `Wave ${this.wave+1}/${this.cache.json.get("wavedata").length}`, {
      font: "18px monospace",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000000"
    }).setDepth(LayerDepth.UI);

    this.hud = this.add.container(this.cameras.main.width - 64, 16).setDepth(LayerDepth.UI);
    let backgroundColor = this.add.graphics();
    backgroundColor.fillStyle(0x000000, 1);
    backgroundColor.fillRect(0, 0, 128, 128);
    this.hud.add(backgroundColor);

    Loader.generateAnimations(this);

    DartMonkeyIcon.create(this);

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

    // this.waveData = this.cache.json.get("wavedata")[this.wave];
    // this.enemiesLeft = this.waveData.enemies.length;
  }

  public update(time: number, delta: number): void {
    if (this.text) {
      this.text.setText(`Wave ${this.wave+1}/${this.cache.json.get("wavedata").length}\nMoney $${this.money}\nLifes ${this.lifes}`);
    }

    if (this.enemies.active < 10 && this.nextEnemy < time) {
      let enemy;

      if (this.lastEnemy == "scorpion") {
        enemy = Larvae.create(this, {
          x: this.spawn.x,
          y: this.spawn.y
        });

        this.lastEnemy = "larvae";
      } else {
        enemy = Scorpion.create(this, {
          x: this.spawn.x,
          y: this.spawn.y
        });

        this.lastEnemy = "scorpion";
      }

      enemy.startOnPath(this.path);
      this.enemies.add(enemy);

      this.nextEnemy = time + 4000;
    }

    this.updateSubscriptions();

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
    this.turrets.forEach(({sprite}) => { sprite.update(time, delta) });
  }

  public updateSubscriptions() {
    this.projectileSubscriptions.length > 0 && this.projectileSubscriptions.forEach((fn) => { fn() });
    this.projectileSubscriptions = Utils.product(this.enemies, this.projectiles).map(([enemy, projectile]) => {
      return this.matterCollision.addOnCollideStart({
        objectA: projectile.getSprite(),
        objectB: enemy.getSprite(),
        context: this,
        callback: (collision) => {
          const { gameObjectB } = collision;

          if (gameObjectB instanceof Phaser.Physics.Matter.Sprite) {
            const { x, y } = gameObjectB as Phaser.Physics.Matter.Sprite;

            enemy.getHit(projectile.params.damage);
            projectile.onCollide();
            projectile.destroy();
            this.projectiles.remove(projectile);

            const explosion = this.add.sprite(x, y, "effects-0", "0").setDepth(LayerDepth.INTERACTION);
            explosion.anims.play("projectiles-0-lvl-0-hit");
            explosion.on("animationcomplete", () => {
              explosion.destroy();
            });
          }
        }
      });
    });
  }

  public loseHealth(enemy: IBloon) {
    this.lifes -= enemy.params.takesHealth;
    enemy.destroy();
    // this.enemies.remove(enemy);

    if (this.lifes <= 0) {
      // this.scene.stop("game");
      // this.scene.start("gameover");
    }
  }

  public getNearestBloon(pos: Phaser.Math.Vector2, maxDistance: number): IBloon | undefined {
    let nearestEnemy: IBloon | undefined;
    let nearestDistance: number = maxDistance;

    this.enemies.forEach((enemy: IBloon) => {
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

  public spawnProjectile(projectile: IProjectile) {
    this.projectiles.add(projectile);
  }

  public checkCollision(tile: Phaser.Tilemaps.Tile): boolean {
    const tile2 = this.world!.getTileAt(tile.x, tile.y-1);

    if (tile.collides) {
      return true;
    }

    if (this.turrets.some((v: PlacedTurret) => {
      const v2 = this.world!.getTileAt(v.tile.x, v.tile.y-1);

      return v2 === tile || v2 === tile2 || v.tile === tile || v.tile === tile2;
    })) {
      return true;
    }

    return false;
  }

  public placeTurret(tile: Phaser.Tilemaps.Tile): void {
    const turret = CrossBowTower.create(this, { x: tile.pixelX, y: tile.pixelY }, {
      sprite: "turrets-0"
    }).then((turret) => {
      this.turrets.push({ sprite: turret, tile: tile as Phaser.Tilemaps.Tile });
    });
  }

  public getTileAtWorldXY(x: number, y: number): Phaser.Tilemaps.Tile | null {
    return this.world!.getTileAtWorldXY(x, y);
  }
}
