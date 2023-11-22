import { Curves, GameObjects } from "phaser";
import GameScene from "../scenes/GameScene";

export default class Enemy extends GameObjects.Sprite {
    public scene: GameScene;

    private path: Curves.Path;
    private follower: { t: number, vec: Phaser.Math.Vector2 };
    
    private hp: number;
    private speed: number;
    private reward: number;
    private takesHealth: number;

    constructor(scene: GameScene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, 'bloons-0', '1');

        this.scene = scene;
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    }

    public startOnPath(path)
    {
        this.path = path;
        this.follower.t = 0;
        
        this.path.getPoint(this.follower.t, this.follower.vec);
        
        this.setPosition(this.follower.vec.x, this.follower.vec.y);            
    }
    
    public receiveDamage(damage) {
        this.hp -= damage;           

        if(this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);
            this.scene.addMoney(this.reward);
            this.scene.enemiesLeft--;
        }
    }
    
    public update(time, delta)
    {
        this.follower.t += (1/50000) * delta * this.speed;

        this.path.getPoint(this.follower.t, this.follower.vec);
        
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        if (this.follower.t >= 1)
        {
            this.setActive(false);
            this.setVisible(false);
            this.scene.removeLife(this.takesHealth);
            this.scene.enemiesLeft--;
        }
    }

    public static damageEnemy(projectile, enemy) {
        if (enemy.active === true && projectile.active === true) {
            enemy.receiveDamage(10);
            projectile.setActive(false);
            projectile.setVisible(false);
        }
    }

    public setHp(hp: number) {
        this.hp = hp;
    }

    public setSpeed(speed: number) {
        this.speed = speed;
    }

    public setReward(reward: number) {
        this.reward = reward;
    }

    public setTakesHealth(takesHealth: number) {
        this.takesHealth = takesHealth;
    }
}