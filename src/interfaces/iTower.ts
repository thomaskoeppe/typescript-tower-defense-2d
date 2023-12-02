import { TowerParams } from '../types';

export type ITower = {
    params: TowerParams;

    update: (time, delta) => void;
    getXY: () => { x: number, y: number };
    getCenter: () => { x: number, y: number };
    getCoords: () => Phaser.Math.Vector2;
    getLevel: () => number;
    upgrade: () => void;
    isMenuShown: () => boolean;
    hideMenu: () => void;
    getMenuXY: () => { x: number, y: number };
}