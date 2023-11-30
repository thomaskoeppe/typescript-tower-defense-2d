import { AbstractTowerIcons } from "../TowerIcons";

export class DartMonkeyIcon extends AbstractTowerIcons {
    constructor(scene, params) {
        super(scene, params);
    }

    static create(scene) {
        return new DartMonkeyIcon(scene, {
            sprite: 'monkey-0',
            radius: 32,
            maxDistance: 250
        });
    }
}