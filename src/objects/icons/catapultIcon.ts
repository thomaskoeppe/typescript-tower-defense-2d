import { AbstractTowerIcons } from '../TowerIcons';
import { Catapult } from '../towers';

export class CatapultIcon extends AbstractTowerIcons {
    constructor (scene, params, { x, y }: { x: number, y: number }) {
        super(scene, params, { x, y });
    }

    static create (scene, { x, y }: { x: number, y: number }) {
        return new CatapultIcon(scene, {
            sprite: 'towers-2',
            frame: '1',
            radius: 32,
            maxDistance: 250,
            placeTower: (scene, tile) => {
                if (scene.getMoney() < Catapult.config.economy.buildCost) {
                    console.log('Not enough money!');
                    return;
                }
        
                const tower = Catapult.create(scene, { x: tile.pixelX + 32, y: tile.pixelY });
        
                scene.turrets.push({ sprite: tower, tile: tile as Phaser.Tilemaps.Tile });
        
                tower.build();
            }
        }, { x, y });
    }
}
