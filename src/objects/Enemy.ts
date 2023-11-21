import { Curves, GameObjects } from "phaser";

export default class Enemy extends GameObjects.Sprite {
    private path: Curves.Path;
    private follower: { t: number, vec: Phaser.Math.Vector2 };
    private hp: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, 'sprites', 'enemy');

        this.setDisplaySize(32, 32);
        this.height = 32;
        this.width = 32;

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.hp = 0;
    }

    public startOnPath(path)
    {
        this.path = path;
        this.follower.t = 0;
        this.hp = 100;
        
        this.path.getPoint(this.follower.t, this.follower.vec);
        
        this.setPosition(this.follower.vec.x, this.follower.vec.y);            
    }
    
    public receiveDamage(damage) {
        this.hp -= damage;           
        
        // if hp drops below 0 we deactivate this enemy
        if(this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);      
        }
    }
    
    public update(time, delta)
    {
        this.follower.t += (1/10000) * delta;
        this.path.getPoint(this.follower.t, this.follower.vec);
        
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        if (this.follower.t >= 1)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}