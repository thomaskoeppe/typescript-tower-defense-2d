import Matter from "matter-js";
import Parser from "../lib/TextParser";
import GameScene, { CollisionGroup } from "../scenes/GameScene";
import { CanDie, Enemy } from './GameObject';

export default class Bloon implements Enemy, CanDie {
    private scene: GameScene;
    private sprite: Phaser.Physics.Matter.Sprite;

    private path: Phaser.Curves.Path | undefined;
    private follower: { t: number, vec: Phaser.Math.Vector2 };
    
    private body: MatterJS.BodyFactory;
    private bodies: MatterJS.BodiesFactory;

    private hp: number;
    private speed: number;
    private reward: number;
    private takesHealth: number;

    private debugUid: string;
    private debugText: Phaser.GameObjects.Text;

    constructor(scene: GameScene, v) {
        v.scale = v.scale || 1.0;

        this.scene = scene;
        this.sprite = this.scene.matter.add.sprite(v.x, v.y, "bloons-0", "1");

        this.body = this.scene.matter.body;
        this.bodies = this.scene.matter.bodies;

        const { width: w, height: h } = this.sprite;
        

        const mainBody = this.bodies.rectangle(0, 0, w, h, { chamfer: { radius: 20 } });

        const compoundBody = this.body.create({
            parts: [mainBody],
            frictionAir: 0.0,
            friction: 0.0,
            frictionStatic: 0.0,
        });

        this.sprite.setExistingBody(compoundBody).setCollisionGroup(CollisionGroup.ENEMY).setPosition(v.x, v.y).setScale(v.scale);

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.hp = 100;
        this.speed = 1;
        this.reward = 10;
        this.takesHealth = 1;

        this.debugUid = Math.random().toString(36).substr(2, 3).toUpperCase();
        this.debugText = this.scene.add.text(v.x, v.y, "N/A", { color: "#ffffff", backgroundColor: "#000000", font: "18px monospace", padding: { x: 20, y: 10 } });
    }

    public static create(scene, v) {
        return new Bloon(scene, v);
    }

    public startOnPath(path)
    {
        this.path = path;
        this.follower.t = 0;

        this.path!.getPoint(this.follower.t, this.follower.vec);
        
        this.sprite.setPosition(this.follower.vec.x, this.follower.vec.y);         
    }
    
    public receiveDamage(damage) {
        this.hp -= damage;

        if(this.hp <= 0) {
            // this.setActive(false);
            // this.setVisible(false);
            // this.scene.addMoney(this.reward);
            // this.scene.enemiesLeft--;
        }
    }
    
    public update(time, delta)
    {
        this.follower.t += (1/50000) * delta * this.speed;

        this.path!.getPoint(this.follower.t, this.follower.vec);
        
        this.sprite.setPosition(this.follower.vec.x, this.follower.vec.y);

        if (this.follower.t >= 1)
        {
            // TODO: how to check if has reached end?
            // this.setActive(false);
            // this.setVisible(false);
            // this.scene.removeLife(this.takesHealth);
            // this.scene.enemiesLeft--;
        }

        this.debugText.setPosition(this.sprite.x+32, this.sprite.y+32);
        this.debugText.setText(Parser.parseText("HP: %HP%\nSpeed: %SPEED%\nReward: %REWARD%\nTakesHealth: %TAKESHEALTH%\nSourceSize: %SOURCEWIDTH%x%SOURCEHEIGHT%\nSize: %WIDTH%x%HEIGHT%\nID: %ID%", {
            HP: this.hp,
            SPEED: this.speed,
            REWARD: this.reward,
            TAKESHEALTH: this.takesHealth,
            SOURCEWIDTH: this.sprite.width,
            SOURCEHEIGHT: this.sprite.height,
            WIDTH: this.sprite.width*this.sprite.scale,
            HEIGHT: this.sprite.height*this.sprite.scale,
            ID: this.debugUid
        }));
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

    getXY() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        }
    }

    getVelXY() {
        const {x, y} = (this.sprite.body as MatterJS.BodyType).velocity
        return {
            velX: x,
            velY: y
        }
    }

    getSprite() {
        return this.sprite
    }

    getHit(damage: number) {
        this.hp -= damage
    }

    isDead() {
        return this.hp <= 0 || this.follower.t >= 1
    }

    destroy() {
        this.sprite.destroy()
    }

    hasReachedEnd() {
        return true
    }
}