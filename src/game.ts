import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { AnimatedTiles } from './lib';
import GameScene from './scenes/GameScene';
import OverlayScene from './scenes/OverlayScene';

declare module 'phaser' {
  interface Scene {
    ['matterCollision']: PhaserMatterCollisionPlugin;
    ['animatedTiles']: AnimatedTiles;
  }

  namespace Scenes {
    interface Systems {
      ['matterCollision']: PhaserMatterCollisionPlugin;
      ['animatedTiles']: AnimatedTiles;
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        height: 1408,
        width: 2560,
        parent: 'game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    fps: {
        target: 30
    },
    scene: [ GameScene, OverlayScene ],
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin,
                key: 'matterCollision',
                mapping: 'matterCollision'
            },
            {
                plugin: AnimatedTiles,
                key: 'animatedTiles',
                mapping: 'animatedTiles'
            }
        ]
    }
};

window.addEventListener('load', function () { return new Phaser.Game(config); });
