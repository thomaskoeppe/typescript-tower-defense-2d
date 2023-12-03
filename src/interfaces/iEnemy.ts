import { Enemy, CanDie } from '../objects/GameObject';
import { EnemyParams } from '../types';

export interface IEnemy extends Enemy, CanDie {
    startOnPath: (path: Phaser.Curves.Path) => void;
    update: (time, delta) => void;
    getXY: () => { x: number, y: number };
    getVelXY: () => { velX: number, velY: number };
    getSprite: () => Phaser.Physics.Matter.Sprite;
    getHit: (damage: number) => void;
    isDead: () => boolean;
    destroy: () => void;
    hasReachedEnd: () => boolean;
    getCoords: () => Phaser.Math.Vector2;
}