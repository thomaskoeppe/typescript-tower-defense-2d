import { Curves, GameObjects, Math as Math2 } from "phaser";
import Enemy from "./Enemy";
import Turret from "./Turret";
import GameScene from "../scenes/GameScene";

export default class Projectile extends GameObjects.Sprite {
    private lifespan: number = 1000;
    private damage: number = 1;
    private speed: number = 1;
    private fired: boolean = false;

    constructor(scene: GameScene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, 'projectiles-0', '1');

        this.setDisplaySize(24*1.5, 10*1.5);
        this.height = 10*1.5;
        this.width = 24*1.5;
    }
}