import { Scene, Curves, Tilemaps, Input, GameObjects, Physics } from "phaser";
import { IBloon } from "../objects/Bloon";
import { RedBloon } from "../objects/Bloons/RedBloon";
import { isEmpty, range, take, zip } from 'lodash';
import { product } from '../lib/Array';
import { ITower } from "../objects/Tower";
import { DartMonkey } from "../objects/Towers/DartMonkey";
import Loader from "../lib/Loader";
import AutoRemoveList from "../lib/AutoRemoveList";
import Pathfinding from "../lib/Pathfinding";
import { IProjectile } from "~/objects/Projectile";
import { LayerDepth } from "../lib/LayerDepth";
import { DartMonkeyIcon } from "../objects/TowerIcons/DartMonkey";
import { ITowerIcons } from "~/objects/TowerIcons";

export enum CollisionGroup {
  BULLET = -1,
  ENEMY = -2
}

export type PlacedTurret = {
  sprite: ITower,
  tile: Tilemaps.Tile
}

export default class GameScene extends Scene {
  private spawn: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
  private goal: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;

  private mapdata: any;

  private wave: number = 0;
  private waveData: any;
  public enemiesLeft: number = 0;
  private enemiesSpawned: number = 0;
  private nextEnemy: number = 0;

  private text: GameObjects.Text | undefined;

  private money: number = 0;
  private lifes: number = 10;

  private path: Curves.Path | undefined;
  private world: Tilemaps.Tilemap | undefined;

  public hud: GameObjects.Container | undefined;
  private _tempDragObject: GameObjects.Image | undefined;

  public enemies: AutoRemoveList<IBloon>;
  public projectiles: AutoRemoveList<IProjectile>;
  public turrets: PlacedTurret[];

  private projectileSubscriptions: (() => void)[]

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
    this.world = this.make.tilemap({ key: "tilemap" });

    const baseTiles = this.world.addTilesetImage("tiles-base");
    const waterTiles = this.world.addTilesetImage("tiles-water");
    const leavesTiles = this.world.addTilesetImage("tiles-leaves");
    const windTiles = this.world.addTilesetImage("tiles-wind");

    const groundLayer = this.world.createLayer("Ground", [baseTiles!], 0, 0);
    const waterLayer = this.world.createLayer("Water", [waterTiles!], 0, 0);
    const pathLayer = this.world.createLayer("Path", [baseTiles!], 0, 0);
    const decorationsLayer = this.world.createLayer("Decorations", [baseTiles!], 0, 0);
    const animationsLayer = this.world.createLayer("Animations", [leavesTiles!, windTiles!], 0, 0);
    const interactionLayer = this.world.createLayer("Interaction", [baseTiles!], 0, 0);

    groundLayer!.setDepth(LayerDepth.GROUND);
    waterLayer!.setDepth(LayerDepth.WATER);
    pathLayer!.setDepth(LayerDepth.PATH);
    decorationsLayer!.setDepth(LayerDepth.DECORATIONS);
    animationsLayer!.setDepth(LayerDepth.ANIMATIONS);
    interactionLayer!.setDepth(LayerDepth.INTERACTION);

    interactionLayer!.forEachTile((tile: Tilemaps.Tile) => {
      if (tile.index === -1) {
        tile.index = 72;
      }
    });

    this.world.setLayer(interactionLayer!);
    this.world.setCollisionByProperty({ isBlocked: true });
    this.animatedTiles.init(this.world, [this.world.getLayerIndex(animationsLayer!), this.world.getLayerIndex(waterLayer!)]);
    this.animatedTiles.setRate(0.5);

    this.mapdata = this.cache.json.get("mapdata");
    this.matter.world.setBounds(0, 0, this.world.widthInPixels, this.world.heightInPixels);

    this.spawn = new Phaser.Math.Vector2(this.mapdata.spawn.x, this.mapdata.spawn.y);
    this.goal = new Phaser.Math.Vector2(this.mapdata.goal.x, this.mapdata.goal.y);
    this.path = Pathfinding.create(this.path!, this.mapdata.path, this.spawn, this.goal);

    this.text = this.add.text(16, 16, `Wave ${this.wave+1}/${this.cache.json.get("wavedata").length}`, {
      font: "18px monospace",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000000"
    });

    this.hud = this.add.container(this.cameras.main.width - 64, 16).setDepth(LayerDepth.UI);
    let backgroundColor = this.add.graphics();
    backgroundColor.fillStyle(0x000000, 1);
    backgroundColor.fillRect(0, 0, 128, 128);
    this.hud.add(backgroundColor);

    DartMonkeyIcon.create(this);

    // this.input.on("dragstart", (pointer: Input.Pointer, gameObject: ITowerIcons) => {
    //   console.log(gameObject)
    //   gameObject.dragStart();
    // });

    // this.input.on("drag", (pointer: Input.Pointer, gameObject: ITowerIcons, dragX: number, dragY: number) => {
    //   gameObject.moveTo(dragX, dragY);
    // });

    // this.input.on("dragend", (pointer: Input.Pointer, gameObject: ITowerIcons, dragX: number, dragY: number) => {
    //   gameObject.dragEnd();
    //   // gameObject.x = gameObject.input!.dragStartX;
    //   // gameObject.y = gameObject.input!.dragStartY;
    // });

    // this.waveData = this.cache.json.get("wavedata")[this.wave];
    // this.enemiesLeft = this.waveData.enemies.length;
  }

  public update(time: number, delta: number): void {
    if (this.text) {
      this.text.setText(`Wave ${this.wave+1}/${this.cache.json.get("wavedata").length}\nMoney $${this.money}\nLifes ${this.lifes}`);
    }

    // if (this.enemies.active < 20 && this.nextEnemy < time) {
    //   const enemy = RedBloon.create(this, {
    //     x: this.spawn.x,
    //     y: this.spawn.y
    //   });
    //   enemy.startOnPath(this.path);
    //   this.enemies.add(enemy);

    //   this.nextEnemy = time + 200;
    // }

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
    this.projectiles.update(time, delta)
    this.turrets.forEach(({sprite}) => { sprite.update(time, delta) });
  }

  public updateSubscriptions() {
    this.projectileSubscriptions.length > 0 && this.projectileSubscriptions.forEach((fn) => { fn() });
    this.projectileSubscriptions = product(this.enemies, this.projectiles).map(([enemy, projectile]) => {
      return this.matterCollision.addOnCollideStart({
        objectA: projectile.getSprite(),
        objectB: enemy.getSprite(),
        context: this,
        callback: (collision) => {
          const { gameObjectA, gameObjectB } = collision;
          if (gameObjectB instanceof Phaser.Physics.Matter.Sprite) {
            enemy.getHit(projectile.params.damage);
            projectile.destroy();
            this.projectiles.remove(projectile);

            const { x, y } = collision.gameObjectB as Phaser.Physics.Matter.Sprite;

            const explosion = this.add.sprite(x, y, 'effects-0', Math.floor(Math.random() * 3) + 1).setScale(1.5);
            setTimeout(() => {
                explosion.destroy();
            }, 50);
          }
        }
      });
    });
  }

  public loseHealth(enemy: IBloon) {
    this.lifes -= enemy.params.takesHealth;
    enemy.destroy();
    this.enemies.remove(enemy);

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

  public checkCollision(x: number, y: number, r: number): boolean {
    const tiles = this.world!.getTilesWithinShape(new Phaser.Geom.Circle(x, y, r));

    if (tiles === null) {
      return false;
    }

    return tiles.some((v: Tilemaps.Tile) => { return v.collides });
  }

  public placeTurret(tile: Phaser.Tilemaps.Tile): void {
    if (this.turrets.some((v: PlacedTurret) => { console.log(v); return v.tile === tile })) {
      const text = this.add.text(this.cameras.main.width / 2, 16, "Turret already placed here", {
        font: "18px monospace",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000000"
      }).setOrigin(0.5, 0).setDepth(LayerDepth.UI_ITEM);

      setTimeout(() => {
        text.destroy();
      }, 2500);

      return;
    }

    if (tile && tile.properties.collides) {
      const text = this.add.text(this.cameras.main.width / 2, 16, "Cannot place turret here", {
        font: "18px monospace",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000000"
      }).setOrigin(0.5, 0).setDepth(LayerDepth.UI_ITEM);

      setTimeout(() => {
        text.destroy();
      }, 2500);

      return;
    }

    const turret = DartMonkey.create(this, { x: tile.pixelX, y: tile.pixelY }, {
      sprite: "turrets-0"
    });

    this.turrets.push({ sprite: turret, tile: tile as Tilemaps.Tile });
  }

  public getTileAtWorldXY(x: number, y: number): Tilemaps.Tile | null {
    return this.world!.getTileAtWorldXY(x, y);
  }
}
