import { Dart } from "../Projectiles/Dart";
import { AbstractTower, ITower, TowerConfig } from "../Tower";
import { LayerDepth } from "../../lib/Utils";
import { ProgressBar } from "../UI/ProgressBar";

export class CrossBowTower extends AbstractTower {
    private config: TowerConfig = {
        offsetX: 32,
        offsetY: 0,
        maxLevel: 3,
        economy: {
            buildCost: 100,
            sellPercentage: 0.8
        },
        level: {
            "1": {
                weapon: {
                    sprite: "weapons-0-lvl-0",
                    shootAnim: "weapons-0-lvl-0-shoot",
                    shootFrame: 2,
                    offsetX: 0,
                    offsetY: -8,
                    cooldown: 1000,
                    distance: 250,
                    shoot: (source, target) => {
                        this.scene.spawnProjectile(Dart.create(this.scene, source, target));
                    },
                },
                sprite: "towers-0",
                upgradeCost: 50,
                build: {
                    buildAnim: "tower-build-0",
                    finishAnim: "tower-build-0-finish",
                    duration: 10000
                }
            }
        }
    }

    constructor(scene, v, tv) {
        super(scene, v, {cooldown: 1000, sprite: 'towers-0', maxDistance: 250, maxLevel: 3});
    }

    static create(scene, v, tv): Promise<ITower> {
        v.x += 32;

        return new Promise((resolve, reject) => {
            const buildAnimation = scene.add.sprite(v.x, v.y, "tower-animations", "0").setDepth(LayerDepth.UI);
            buildAnimation.anims.play("tower-build-0");

            new ProgressBar(scene, v.x, v.y, 32, 4, 0x00ff00, 10000, () => {
                const buildAnimation2 = scene.add.sprite(v.x, v.y, "tower-animations", "0").setDepth(LayerDepth.UI);
                buildAnimation2.anims.play("tower-build-0-finish");

                buildAnimation2.on('animationcomplete', () => {
                    buildAnimation.destroy();
                    buildAnimation2.destroy();
                    resolve(new CrossBowTower(scene, v, tv));
                });
            });
        });
    }

    shoot(target) {
        this.scene.spawnProjectile(Dart.create(this.scene, new Phaser.Math.Vector2(this.sprite.getCenter().x, this.sprite.getCenter().y), target)); 
    }
}