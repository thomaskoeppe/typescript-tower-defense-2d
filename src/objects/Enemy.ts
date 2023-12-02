import Matter from 'matter-js';
import GameScene from '../scenes/GameScene';
import { CanDie, Enemy } from './GameObject';
import { CollisionGroup, LayerDepth, Utils } from '../lib/Utils';
import { HealthBar } from './UI/HealthBar';

export interface IEnemy extends Enemy, CanDie {
    params: EnemyParams;
    debugUid: string;

    startOnPath: (path: Phaser.Curves.Path) => void;
    update: (time, delta) => void;
    setHp: (hp: number) => void;
    setSpeed: (speed: number) => void;
    setReward: (reward: number) => void;
    setTakesHealth: (takesHealth: number) => void;
    getXY: () => { x: number, y: number };
    getVelXY: () => { velX: number, velY: number };
    getSprite: () => Phaser.Physics.Matter.Sprite;
    getHit: (damage: number) => void;
    isDead: () => boolean;
    destroy: () => void;
    hasReachedEnd: () => boolean;
    getCoords: () => Phaser.Math.Vector2;
}

export type EnemyParams = {
    hp: number,
    speed: number,
    reward: number,
    takesHealth: number,
    scale: number,
    sprite: string,
    frame: string,
    canFly: boolean,
    flipX?: boolean,
    body: {
        width: number,
        height: number,
        radius: number,
        rotation: {
            right: {
                angle: number,
                flipX?: boolean,
                flipY?: boolean
            },
            down: {
                angle: number,
                flipX?: boolean,
                flipY?: boolean
            },
            up: {
                angle: number,
                flipX?: boolean,
                flipY?: boolean
            },
            left: {
                angle: number,
                flipX?: boolean,
                flipY?: boolean
            }
        }
    },
    animSet: {[key: string]: string}
}

export abstract class AbstractEnemy implements IEnemy {
    private scene: GameScene;
    private sprite: Phaser.Physics.Matter.Sprite;

    public params: EnemyParams;

    private path: Phaser.Curves.Path | undefined;
    private follower: { t: number, vec: Phaser.Math.Vector2 };
    
    private body: MatterJS.BodyFactory;
    private bodies: MatterJS.BodiesFactory;

    private collisionBody: MatterJS.BodyType;

    private healthBar: HealthBar;

    public debugUid: string;

    // private debugText: Phaser.GameObjects.Text;

    constructor (scene: GameScene, v, params: EnemyParams) {

        this.params = params;
        this.scene = scene;

        this.body = this.scene.matter.body;
        this.bodies = this.scene.matter.bodies;

        this.sprite = this.scene.matter.add.sprite(v.x, v.y, this.params.sprite, this.params.frame);
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };

        this.collisionBody = this.bodies.rectangle(0, 0, this.params.body.width, this.params.body.height, { chamfer: { radius: this.params.body.radius } });

        this.sprite.setExistingBody(this.body.create({
            parts: [ this.collisionBody ]
        })).setCollisionGroup(CollisionGroup.ENEMY).setPosition(v.x, v.y).setScale(this.params.scale).setAngle(0);

        this.sprite.setStatic(true);
        this.sprite.setDepth(LayerDepth.ENEMY);

        this.healthBar = new HealthBar(this.scene, v.x, v.y, this.params.hp);

        this.debugUid = Math.random().toString(36).substr(2, 3).toUpperCase();

        // this.debugText = this.scene.add.text(v.x, v.y, "N/A", { color: "#ffffff", backgroundColor: "#000000", font: "18px monospace", padding: { x: 20, y: 10 } }).setDepth(LayerDepth.UI);

        this.scene.createEnemy(this);
    }

    public startOnPath (path) {
        this.path = path;
        this.follower.t = 0;

        this.path!.getPoint(this.follower.t, this.follower.vec);
        
        this.sprite.setPosition(this.follower.vec.x, this.follower.vec.y);
    }
    
    public update (time, delta) {
        // this.follower.t += (1/20000) * delta * this.params.speed;
        this.follower.t += (1 / 200000) * delta * this.params.speed;

        this.path!.getPoint(this.follower.t, this.follower.vec);

        const angle = Math.atan2(this.follower.vec.y - this.sprite.y, this.follower.vec.x - this.sprite.x) * 180 / Math.PI;

        if (angle >= -44 && angle <= 45) {
            if (!this.sprite.anims.currentAnim || this.sprite.anims.currentAnim.key !== this.params.animSet['walk-lr']) {
                this.sprite.anims.play(this.params.animSet['walk-lr']);
            }

            this.sprite.flipX = this.params.body.rotation.right.flipX || false;
            this.sprite.flipY = this.params.body.rotation.right.flipY || false;

            this.sprite.setAngle(angle);
            this.body.setAngle(this.collisionBody, this.params.body.rotation.right.angle, false);
        } else if (angle >= 46 && angle < 135) {
            if (!this.sprite.anims.currentAnim || this.sprite.anims.currentAnim.key !== this.params.animSet['walk-down']) {
                this.sprite.anims.play(this.params.animSet['walk-down']);
            }

            this.sprite.flipX = this.params.body.rotation.down.flipX || false;
            this.sprite.flipY = this.params.body.rotation.down.flipY || false;

            this.sprite.setAngle(angle - 90);
            this.body.setAngle(this.collisionBody, this.params.body.rotation.down.angle, false);
        } else if (angle >= 135 || angle < -135) {
            if (!this.sprite.anims.currentAnim || this.sprite.anims.currentAnim.key !== this.params.animSet['walk-lr']) {
                this.sprite.anims.play(this.params.animSet['walk-lr']);
            }

            this.sprite.flipX = this.params.body.rotation.left.flipX || false;
            this.sprite.flipY = this.params.body.rotation.left.flipY || false;

            this.sprite.setAngle(180);
            this.body.setAngle(this.collisionBody, this.params.body.rotation.left.angle, false);
        } else if (angle >= -135 && angle < -46) {
            if (!this.sprite.anims.currentAnim || this.sprite.anims.currentAnim.key !== this.params.animSet['walk-up']) {
                this.sprite.anims.play(this.params.animSet['walk-up']);
            }

            this.sprite.flipX = this.params.body.rotation.up.flipX || false;
            this.sprite.flipY = this.params.body.rotation.up.flipY || false;

            this.sprite.setAngle(angle + 90);
            this.body.setAngle(this.collisionBody, this.params.body.rotation.up.angle, false);
        }

        this.sprite.setPosition(this.follower.vec.x, this.follower.vec.y);
        this.healthBar.update(this.sprite.x, this.sprite.y + 32, this.params.hp);

        // this.debugText.setPosition(this.sprite.x+32, this.sprite.y+32);
        // this.debugText.setText(Utils.parseText("HP: %HP%\nSpeed: %SPEED%\nReward: %REWARD%\nTakesHealth: %TAKESHEALTH%\nSourceSize: %SOURCEWIDTH%x%SOURCEHEIGHT%\nSize: %WIDTH%x%HEIGHT%\nID: %ID%", {
        //     HP: this.params.hp,
        //     SPEED: this.params.speed,
        //     REWARD: this.params.reward,
        //     TAKESHEALTH: this.params.takesHealth,
        //     SOURCEWIDTH: this.sprite.width,
        //     SOURCEHEIGHT: this.sprite.height,
        //     WIDTH: this.sprite.width*this.sprite.scale,
        //     HEIGHT: this.sprite.height*this.sprite.scale,
        //     ID: this.debugUid
        // }));

        if (this.follower.t >= 1) {
            this.scene.loseHealth(this);
        }
    }

    public setHp (hp: number) {
        this.params.hp = hp;
    }

    public setSpeed (speed: number) {
        this.params.speed = speed;
    }

    public setReward (reward: number) {
        this.params.reward = reward;
    }

    public setTakesHealth (takesHealth: number) {
        this.params.takesHealth = takesHealth;
    }

    getXY () {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        };
    }

    getVelXY () {
        const {x: x, y: y} = (this.sprite.body as MatterJS.BodyType).velocity;
        return {
            velX: x,
            velY: y
        };
    }

    getSprite () {
        return this.sprite;
    }

    getHit (damage: number) {
        this.params.hp -= damage;
    }

    isDead () {
        return this.params.hp <= 0 || this.follower.t >= 1;
    }

    destroy () {
        // this.debugText.destroy();
        this.sprite.destroy();
        this.healthBar.destroy();
    }

    hasReachedEnd () {
        return true;
    }

    getCoords () {
        return new Phaser.Math.Vector2(this.sprite.x, this.sprite.y);
    }
}
