import { Scene, Curves, Tilemaps, Input, GameObjects, Physics } from "phaser";
import { Bloon, RedBloon } from "../objects/Bloon";
import { isEmpty, range, take, zip } from 'lodash';
import { DartMonkey, AbstractTower, ITower } from "../objects/Tower";
import Loader from "../lib/Loader";
import AutoRemoveList from "../lib/AutoRemoveList";
import Pathfinding from "../lib/Pathfinding";
import { Dart, IProjectile } from "~/objects/Projectile";

export enum CollisionGroup {
  BULLET = -1,
  ENEMY = -2
}

export type PlacedTurret = {
  sprite: AbstractTower,
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
  private world: Tilemaps.TilemapLayer | undefined;

  public hud: GameObjects.Container | undefined;

  public enemies: AutoRemoveList<Bloon>;
  public projectiles: AutoRemoveList<IProjectile>;
  private turrets: PlacedTurret[];

  constructor() {
    super({ key: "game", active: true, visible: true });

    this.enemies = new AutoRemoveList<Bloon>();
    this.projectiles = new AutoRemoveList<IProjectile>();
    this.turrets = [];
  }

  public preload() {
    Loader.initiate(this);
  }

  public create() {
    const tilemap = this.make.tilemap({ key: "tilemap" });
    const tileset = tilemap.addTilesetImage("tiles");

    if (tileset === null) {
      throw new Error("Tileset not found");
    }

    const layer1 = tilemap.createLayer("Layer 1", tileset, 0, 0);

    if (layer1 === null) {
      throw new Error("Layer not found");
    }

    this.mapdata = this.cache.json.get("mapdata")
    this.world = layer1;
    this.world.setCollisionByProperty({ collides: true });

    this.matter.world.setBounds(0, 0, tilemap.widthInPixels, tilemap.heightInPixels);

    this.spawn = new Phaser.Math.Vector2(this.mapdata.spawn.x, this.mapdata.spawn.y);
    this.goal = new Phaser.Math.Vector2(this.mapdata.goal.x, this.mapdata.goal.y);

    this.path = Pathfinding.create(this.path!, this.mapdata.path, this.spawn, this.goal);

    this.text = this.add.text(16, 16, `Wave ${this.wave+1}/${this.cache.json.get("wavedata").length}`, {
      font: "18px monospace",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000000"
    });

    this.hud = this.add.container(this.cameras.main.width - 64, 16);
    let backgroundColor = this.add.graphics();
    backgroundColor.fillStyle(0x000000, 1);
    backgroundColor.fillRect(0, 0, 128, 128);
    this.hud.add(backgroundColor);

    let monkey = this.add.image(0, 0, "monkey-0").setOrigin(0, 0).setInteractive();
    this.hud.add(monkey);
    this.input.setDraggable(monkey);

    this.input.on("drag", (pointer: Input.Pointer, gameObject: GameObjects.Image, dragX: number, dragY: number) => {
      gameObject.x = dragX;
      gameObject.y = dragY;

      this.world!.replaceByIndex(39, 25);

      const tile = this.world!.getTileAtWorldXY(pointer.worldX, pointer.worldY);
      if (tile && tile.index === 25) {
        tile.index = 39;
      }
    });

    this.input.on("dragend", (pointer: Input.Pointer, gameObject: GameObjects.Image, dragX: number, dragY: number) => {
      gameObject.x = gameObject.input!.dragStartX;
      gameObject.y = gameObject.input!.dragStartY;

      const tile = this.world!.getTileAtWorldXY(pointer.worldX, pointer.worldY);
      if (tile && tile.index === 39) {
        this.placeTurret(pointer);
        console.log("place turret")
      }

      this.world!.replaceByIndex(39, 25);
    });

    this.waveData = this.cache.json.get("wavedata")[this.wave];
    this.enemiesLeft = this.waveData.enemies.length;
  }

  public update(time: number, delta: number): void {
    if (this.text) {
      this.text.setText(`Wave ${this.wave+1}/${this.cache.json.get("wavedata").length}\nMoney $${this.money}\nLifes ${this.lifes}`);
    }

    if (this.enemies.active < 2 && this.nextEnemy < time) {
      const enemy = RedBloon.create(this, {
        x: this.spawn.x,
        y: this.spawn.y
      });
      enemy.startOnPath(this.path);
      this.enemies.add(enemy);

      this.nextEnemy = time + 2000;
    }

    this.enemies.update(time, delta);
    this.projectiles.update(time, delta)
    this.turrets.forEach(({sprite}) => { sprite.update(time, delta) });

    console.log(this.projectiles.active, this.projectiles)

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

    this.getNearestBloon(new Phaser.Math.Vector2(0, 0), 0);
  }

  public getNearestBloon(pos: Phaser.Math.Vector2, maxDistance: number): Bloon | undefined {
    let nearestEnemy: Bloon | undefined;
    let nearestDistance: number = maxDistance;

    this.enemies.forEach((enemy: Bloon) => {
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

  private placeTurret(pointer: Input.Pointer): void {
    //get tile at pointer
    const x = Math.floor(pointer.x / 64) * 64 + 32;
    const y = Math.floor(pointer.y / 64) * 64 + 32;
    const tile = this.world!.getTileAtWorldXY(x, y);

    if (this.turrets.some((v: PlacedTurret) => { return v.tile === tile })) {
      const text = this.add.text(this.cameras.main.width / 2, 16, "Turret already placed here", {
        font: "18px monospace",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000000"
      }).setOrigin(0.5, 0);;

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
      }).setOrigin(0.5, 0);

      setTimeout(() => {
        text.destroy();
      }, 2500);

      return;
    }

    const turret = DartMonkey.create(this, { x, y }, {
      sprite: "turrets-0"
    });

    this.turrets.push({ sprite: turret, tile: tile });
  }
}
