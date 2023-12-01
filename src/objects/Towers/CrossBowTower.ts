import { Dart } from "../Projectiles/Dart";
import { AbstractTower, ITower } from "../Tower";
import { LayerDepth } from "../../lib/Utils";
import { ProgressBar } from "../UI/ProgressBar";

export class CrossBowTower extends AbstractTower {
    constructor(scene, v, tv) {
        super(scene, v, {cooldown: 1000, sprite: 'towers-0', maxDistance: 250, maxLevel: 3});
    }

    static create(scene, v, tv): Promise<ITower> {
        v.x += 32;

        const params = {
            cooldown: 1000,
            maxLevel: 3,
            level: {
                "1": {
                    weapon: {
                        sprite: "",
                        offsetX: "",
                        offsetY: "",
                        projectile: "",
                        cooldown: 0,
                    },
                    sprite: "",
                    upgradeAnim: "",
                }
            }
        }

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