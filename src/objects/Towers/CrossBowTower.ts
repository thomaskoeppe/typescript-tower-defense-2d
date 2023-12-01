import { Dart } from "../Projectiles/Dart";
import { AbstractTower, ITower, TowerParams } from "../Tower";
import { LayerDepth } from "../../lib/Utils";
import { ProgressBar } from "../UI/ProgressBar";

export class CrossBowTower extends AbstractTower {
    private static config: TowerParams = {
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
                    shootFrame: "2",
                    offsetX: 0,
                    offsetY: -8,
                    cooldown: 1000,
                    distance: 250,
                    shoot: (scene, source, target) => {
                        scene.spawnProjectile(Dart.create(scene, source, target));
                    },
                },
                sprite: "towers-0",
                upgradeCost: 50,
                build: {
                    sprite: "tower-animations",
                    frame: "0",
                    buildAnim: "tower-build-0",
                    finishAnim: "tower-build-0-finish",
                    duration: 5000
                }
            }
        }
    }

    constructor(scene, v) {
        super(scene, v, CrossBowTower.config);
    }

    static create(scene, v): Promise<ITower> {
        const buildConfig = CrossBowTower.config.level["1"].build;

        return new Promise((resolve, reject) => {
            const buildAnimation = scene.add.sprite(v.x, v.y, buildConfig.sprite, buildConfig.frame).setDepth(LayerDepth.UI);
            buildAnimation.anims.play(buildConfig.buildAnim);

            new ProgressBar(scene, v.x, v.y, buildConfig.duration, () => {
                const buildAnimation2 = scene.add.sprite(v.x, v.y, buildConfig.sprite, buildConfig.frame).setDepth(LayerDepth.UI);
                buildAnimation2.anims.play(buildConfig.finishAnim);

                buildAnimation2.on('animationcomplete', () => {
                    buildAnimation.destroy();
                    buildAnimation2.destroy();
                    resolve(new CrossBowTower(scene, v));
                });
            });
        });
    }

    shoot(target) {
        this.scene.spawnProjectile(Dart.create(this.scene, new Phaser.Math.Vector2(this.sprite.getCenter().x, this.sprite.getCenter().y), target)); 
    }
}