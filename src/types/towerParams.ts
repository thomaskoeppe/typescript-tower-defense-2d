import { TowerLevel } from './towerLevel';

export type TowerParams = {
    offsetX: number,
    offsetY: number,
    maxLevel: number,
    economy: {
        buildCost: number,
        sellPercentage: number
    },
    level: {
        [key: string]: TowerLevel
    }
}