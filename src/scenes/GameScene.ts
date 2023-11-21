import { Scene, Curves, Tilemaps } from "phaser";
import Enemy from "../objects/Enemy";

export default class GameScene extends Scene {
  private mapProperties: {
    start: Tilemaps.Tile;
    end: Tilemaps.Tile;
  }

  private path: Curves.Path;
  private world: Tilemaps.TilemapLayer;

  private nextEnemy: number = 0;
  private enemies: Phaser.Physics.Arcade.Group;

  constructor() {
    super({ key: "game", active: true, visible: true });
  }

  public preload() {
    this.load.atlas('sprites', './assets/sprites/spritesheet.png', './assets/sprites/spritesheet.json');
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

    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xff0000);
    this.path.draw(graphics);

    this.add.text(16, 16, "Wave 0/0", {
      font: "18px monospace",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000000"
    });

    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
  }

  public update(time: number, delta: number): void {
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
