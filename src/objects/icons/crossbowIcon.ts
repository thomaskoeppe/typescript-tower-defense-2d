import { AbstractTowerIcons } from '../TowerIcons';
import { CrossBow } from '../towers';

export class CrossbowIcon extends AbstractTowerIcons {
    constructor (scene, params, { x, y }: { x: number, y: number }) {
        super(scene, params, { x, y });
    }

    static create (scene, { x, y }: { x: number, y: number }) {
        return new CrossbowIcon(scene, {
            sprite: 'towers-0',
            frame: '1',
            radius: 32,
            maxDistance: 250,
            placeTower: (scene, tile) => {
                if (scene.getMoney() < CrossBow.config.economy.buildCost) {
                    console.log('Not enough money!');
                    return;
                }
        
                const tower = CrossBow.create(scene, { x: tile.pixelX + 32, y: tile.pixelY });
        
                scene.turrets.push({ sprite: tower, tile: tile as Phaser.Tilemaps.Tile });
        
                tower.build();
            }
        }, { x, y });
    }
}
