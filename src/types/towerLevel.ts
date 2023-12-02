import GameScene from '../scenes/GameScene';

export type TowerLevel = {
    weapon: {
        sprite: string,
        frame: number,
        shootAnim: string,
        shootFrame: number,
        offsetX: number,
        offsetY: number,
        cooldown: number,
        distance: number,
        shoot: (scene: GameScene, source: Phaser.Math.Vector2, target: Phaser.Math.Vector2) => void
    },
    sprite: string,
    frame: number,
    upgradeCost: number,
    build: {
        sprite: string,
        frame: number,
        buildAnim: string,
        startAnim?: string,
        finishAnim: string,
        duration: number
    }
}