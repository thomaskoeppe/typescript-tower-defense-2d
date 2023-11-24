import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import GameScene from "./scenes/GameScene";

const pluginConfig = {
  plugin: PhaserMatterCollisionPlugin,
  key: "matterCollision" as "matterCollision",
  mapping: "matterCollision" as "matterCollision",
};

declare module "phaser" {
  interface Scene {
    [pluginConfig.mapping]: PhaserMatterCollisionPlugin;
  }
  namespace Scenes {
    interface Systems {
      [pluginConfig.key]: PhaserMatterCollisionPlugin;
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
    scene: [pluginConfig],
  },
};

window.addEventListener("load", () => new Phaser.Game(config));
