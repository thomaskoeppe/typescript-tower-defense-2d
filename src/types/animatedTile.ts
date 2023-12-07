export type AnimatedTile = {
    map: Phaser.Tilemaps.Tilemap,
    animatedTiles: any[],
    active: boolean,
    rate: number,
    activeLayer: boolean[]
}