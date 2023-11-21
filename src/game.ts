import { AUTO as hasWebGlSupport, Types, Game } from "phaser";
import GameScene from "./scenes/GameScene";

const config: Types.Core.GameConfig = {
  type: hasWebGlSupport,
  scale: {
    height: 1408,
    width: 2560,
    parent: "game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // input: {
  //   keyboard: true,
  //   gamepad: true,
  // },
  // render: {
  //   pixelArt: true,
  //   antialias: false,
  //   antialiasGL: false,
  // },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  scene: [GameScene],
};

window.addEventListener("load", () => new Game(config));
