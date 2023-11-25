import Matter from "matter-js";
import Parser from "../lib/TextParser";
import GameScene, { CollisionGroup } from "../scenes/GameScene";
import { CanDie, Enemy } from './GameObject';

export type BloonParams = {
    hp: number,
    speed: number,
    reward: number,
    takesHealth: number,
    scale: number,
    sprite: string,
    frame: string,
    radius: number,
}

export abstract class Bloon implements Enemy, CanDie {
    private scene: GameScene;
    private sprite: Phaser.Physics.Matter.Sprite;

    public params: BloonParams;

    private path: Phaser.Curves.Path | undefined;
    private follower: { t: number, vec: Phaser.Math.Vector2 };
    
    private body: MatterJS.BodyFactory;
    private bodies: MatterJS.BodiesFactory;

    private debugUid: string;
    private debugText: Phaser.GameObjects.Text;

    constructor(scene: GameScene, v, params: BloonParams) {
        this.params = params;
        this.scene = scene;

        this.body = this.scene.matter.body;
        this.bodies = this.scene.matter.bodies;

        this.sprite = this.scene.matter.add.sprite(v.x, v.y, this.params.sprite, this.params.frame);
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

        this.sprite.setExistingBody(this.body.create({
            parts: [this.bodies.rectangle(0, 0, this.sprite.width, this.sprite.height, { chamfer: { radius: this.params.radius } })],
            frictionAir: 0.0,
            friction: 0.0,
            frictionStatic: 0.0,
        })).setCollisionGroup(CollisionGroup.ENEMY).setPosition(v.x, v.y).setScale(this.params.scale);

        this.debugUid = Math.random().toString(36).substr(2, 3).toUpperCase();
        this.debugText = this.scene.add.text(v.x, v.y, "N/A", { color: "#ffffff", backgroundColor: "#000000", font: "18px monospace", padding: { x: 20, y: 10 } });
    }

    public startOnPath(path)
    {
        this.path = path;
        this.follower.t = 0;

        this.path!.getPoint(this.follower.t, this.follower.vec);
        
        this.sprite.setPosition(this.follower.vec.x, this.follower.vec.y);         
    }
    
    public receiveDamage(damage) {
        this.params.hp -= damage;

        if(this.params.hp <= 0) {
            // this.setActive(false);
            // this.setVisible(false);
            // this.scene.addMoney(this.reward);
            // this.scene.enemiesLeft--;
        }
    }
    
    public update(time, delta)
    {
        this.follower.t += (1/50000) * delta * this.params.speed;

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
            HP: this.params.hp,
            SPEED: this.params.speed,
            REWARD: this.params.reward,
            TAKESHEALTH: this.params.takesHealth,
            SOURCEWIDTH: this.sprite.width,
            SOURCEHEIGHT: this.sprite.height,
            WIDTH: this.sprite.width*this.sprite.scale,
            HEIGHT: this.sprite.height*this.sprite.scale,
            ID: this.debugUid
        }));
    }

    public static damageEnemy(projectile, enemy, damage) {
        if (enemy.active === true && projectile.active === true) {
            enemy.receiveDamage(damage);
            
            projectile.setActive(false);
            projectile.setVisible(false);
        }
    }

    public setHp(hp: number) {
        this.params.hp = hp;
    }

    public setSpeed(speed: number) {
        this.params.speed = speed;
    }

    public setReward(reward: number) {
        this.params.reward = reward;
    }

    public setTakesHealth(takesHealth: number) {
        this.params.takesHealth = takesHealth;
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
        this.params.hp -= damage
    }

    isDead() {
        return this.params.hp <= 0 || this.follower.t >= 1
    }

    destroy() {
        this.sprite.destroy()
    }

    hasReachedEnd() {
        return true
    }
}

export { RedBloon } from './Bloons/RedBloon';