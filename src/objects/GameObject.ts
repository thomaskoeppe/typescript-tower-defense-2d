export default interface GameObject {
    getXY: () => { x: number, y: number }
    getVelXY: () => { velX: number, velY: number }
    getSprite: () => Phaser.Physics.Matter.Sprite
    destroy: () => void
    update: (time: number, delta: number) => void
}

export interface CanDie extends GameObject {
    isDead: () => boolean
}

export interface Enemy extends CanDie {
    getHit: (damage: number) => void
    hasReachedEnd: () => boolean
}