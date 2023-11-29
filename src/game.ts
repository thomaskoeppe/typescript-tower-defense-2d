import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { AnimatedTiles } from "./lib/AnimatedTiles";
import GameScene from "./scenes/GameScene";

declare module "phaser" {
  interface Scene {
    ["matterCollision"]: PhaserMatterCollisionPlugin;
    ["animatedTiles"]: AnimatedTiles;
    ["rexUI"]: RexUIPlugin;
  }

  namespace Scenes {
    interface Systems {
      ["matterCollision"]: PhaserMatterCollisionPlugin;
      ["animatedTiles"]: AnimatedTiles;
      ["rexUI"]: RexUIPlugin;
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
  fps: {
    target: 30
  },
  scene: [GameScene],
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: "matterCollision",
        mapping: "matterCollision",
      },
      {
        plugin: AnimatedTiles,
        key: "animatedTiles",
        mapping: "animatedTiles",
      },
      {
        plugin: RexUIPlugin,
        key: "rexuiplugin",
        mapping: "rexUI",
      },
    ],
  },
};

window.addEventListener("load", () => new Phaser.Game(config));
