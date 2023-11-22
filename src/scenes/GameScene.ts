import { Scene, Curves, Tilemaps, Input, GameObjects } from "phaser";
import Enemy from "../objects/Enemy";
import Turret from "../objects/Turret";

export default class GameScene extends Scene {
  private mapProperties: {
    start: Tilemaps.Tile;
    end: Tilemaps.Tile;
  }

  private path: Curves.Path;
  private world: Tilemaps.TilemapLayer;

  private nextEnemy: number = 0;
  private enemies: Phaser.Physics.Arcade.Group;
  private turrets: Phaser.Physics.Arcade.Group;

  constructor() {
    super({ key: "game", active: true, visible: true });
  }

  public preload() {
    this.load.atlas('bloons-0', './assets/sprites/bloons/0/spritesheet.png', './assets/sprites/bloons/0/spritesheet.json');
    this.load.atlas('bloons-1', './assets/sprites/bloons/1/spritesheet.png', './assets/sprites/bloons/1/spritesheet.json');
    this.load.atlas('bloons-2', './assets/sprites/bloons/2/spritesheet.png', './assets/sprites/bloons/2/spritesheet.json');
    this.load.atlas('bloons-3', './assets/sprites/bloons/3/spritesheet.png', './assets/sprites/bloons/3/spritesheet.json');
    this.load.atlas('bloons-4', './assets/sprites/bloons/4/spritesheet.png', './assets/sprites/bloons/4/spritesheet.json');

    this.load.atlas('turrets-0', './assets/sprites/turrets/0/spritesheet.png', './assets/sprites/turrets/0/spritesheet.json');
    this.load.atlas('projectiles-0', './assets/sprites/projectiles/0/spritesheet.png', './assets/sprites/projectiles/0/spritesheet.json');

    this.load.image("tiles", "./assets/images/tiles.png");
    this.load.tilemapTiledJSON("tilemap", "./assets/tilemaps/map-1.json");
  }

  public create() {
    const tilemap = this.make.tilemap({ key: "tilemap" });
    const tileset = tilemap.addTilesetImage("tiles");

    this.world = tilemap.createLayer("Layer 1", tileset, 0, 0);
    this.world.setCollisionByProperty({ collides: true });

    this.mapProperties = {
      start: this.world.findByIndex(35),
      end: this.world.findByIndex(35, 0, true)
    };

    this.path = new Curves.Path(this.mapProperties.start.pixelX + this.mapProperties.start.width/2, this.mapProperties.start.pixelY);
    const tiles = this.world.filterTiles((tile) => tile.index === 35);
   
    this.createPath(tiles, this.mapProperties.start, null);

    this.add.text(16, 16, "Wave 0/0", {
      font: "18px monospace",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000000"
    });

    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.turrets = this.physics.add.group({ classType: Turret, runChildUpdate: true });

    this.input.on("pointerdown", this.placeTurret, this);
  }

  public update(time: number, delta: number): void {
    this.turrets.children.each((turret: Turret) => {
      turret.findNearestEnemy(this.enemies.children.entries);
      return true;
    });

    if (this.enemies.countActive(true) < 10 && time > this.nextEnemy) {
      const enemy = this.enemies.get();

      if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);
        enemy.startOnPath(this.path);

        this.nextEnemy = time + 200;
      }
    }
  }

  private placeTurret(pointer: Input.Pointer): void {
    const x = Math.floor(pointer.x / 64) * 64 + 32;
    const y = Math.floor(pointer.y / 64) * 64 + 32;

    if (this.turrets.children.entries.some((turret: Turret) => { return turret.x === x && turret.y === y; })) {
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

    const tile = this.world.getTileAtWorldXY(x, y);
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

    const turret = this.turrets.get();

    if (turret) {
      turret.setActive(true);
      turret.setVisible(true);
      turret.setPosition(x, y);
    }
  }

  private createPath(tiles: Tilemaps.Tile[], currentTile: Tilemaps.Tile, previousTile: Tilemaps.Tile): void {
    const { x, y } = currentTile;
    
    const neighbours = tiles.filter((tile) => {
      return (
        ((tile.x === x - 1 && tile.y === y) ||
        (tile.x === x + 1 && tile.y === y) ||
        (tile.x === x && tile.y === y - 1) ||
        (tile.x === x && tile.y === y + 1)) &&
        tile !== previousTile
      );
    });

    if (neighbours.length === 0) {
      return;
    }

    const nextTile = neighbours[0];

    if (nextTile === this.mapProperties.end) {
      if (this.world.height === nextTile.bottom) {
        this.path.lineTo(nextTile.pixelX + nextTile.width/2, nextTile.pixelY + nextTile.height);
      } else {
        this.path.lineTo(nextTile.pixelX + nextTile.width, nextTile.pixelY + nextTile.height/2);
      }
    } else {
      this.path.lineTo(nextTile.pixelX + nextTile.width/2, nextTile.pixelY + nextTile.height/2);
      this.createPath(tiles, nextTile, currentTile);
    }
  }
}
