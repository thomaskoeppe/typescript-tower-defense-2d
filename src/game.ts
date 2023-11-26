import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import AnimatedTilesPlugin from 'phaser-animated-tiles-phaser3.5/dist/AnimatedTiles.min.js';
import GameScene from "./scenes/GameScene";

declare module "phaser" {
  interface Scene {
    ["matterCollision"]: PhaserMatterCollisionPlugin;
    ["animatedTiles"]: AnimatedTilesPlugin;
  }

  namespace Scenes {
    interface Systems {
      ["matterCollision"]: PhaserMatterCollisionPlugin;
      ["animatedTiles"]: AnimatedTilesPlugin;
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    height: 1408,
    width: 2560,
    parent: "game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "matter",
    matter: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  scene: [GameScene],
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: "matterCollision" as "matterCollision",
        mapping: "matterCollision" as "matterCollision",
      },
      {
        plugin: AnimatedTilesPlugin,
        key: "animatedTiles" as "animatedTiles",
        mapping: "animatedTiles" as "animatedTiles",
      },
    ],
  },
};

window.addEventListener("load", () => new Phaser.Game(config));
