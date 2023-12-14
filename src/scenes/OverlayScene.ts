import { Button } from '../objects/UI';
import { LayerDepth } from '../lib';
import { Text, TextWithIcon, Frame } from '../objects/UI';

export default class OverlayScene extends Phaser.Scene {
    public healthText: TextWithIcon | undefined;
    public moneyText: TextWithIcon | undefined;
    public waveText: Text | undefined;
    constructor () {
        super({ key: 'OverlayScene', active: true, visible: true });
    }

    public preload () {
        this.load.atlas('buttons', './assets/icons/buttons.png', './assets/icons/buttons.json');
        this.load.atlas('icons-frames-0', './assets/sprites/frames/spritesheet-0.png', './assets/sprites/frames/spritesheet-0.json');
        this.load.atlas('icons-frames-1', './assets/sprites/frames/spritesheet-1.png', './assets/sprites/frames/spritesheet-1.json');
    }

    public create () {
        new Frame(this, this.cameras.main.centerX - 16 * 7, 4, 'icons-frames-1', [
            [ '0', '1', '2', '2', '1', '1', '3' ],
            [ '12', '13', '14', '13', '13', '13', '15' ]
        ], 32);
    
        new Frame(this, 4, 4, 'icons-frames-1', [
            [ '0', '1', '2', '2', '3' ],
            [ '4', '5', '5', '6', '7' ],
            [ '8', '9', '10', '9', '11' ],
            [ '12', '13', '13', '14', '15' ]
        ], 32);
    
        this.healthText = new TextWithIcon(this, 20, 46, 'icons-frames-0', '160', '0', 32, 0x000000);
        this.moneyText = new TextWithIcon(this, 20, 92, 'icons-frames-0', '180', '0', 32, 0x000000);
        this.waveText = new Text(this, 0, 38, 'WAVE 1', 32, 0x000000);
        this.waveText.setPosition(this.cameras.main.centerX - this.waveText.width / 2, 38);

        new Button(this, this.cameras.main.width - 36, 36, { default: 'sprite1372', hover: 'sprite1389', active: 'sprite1407', activeHover: 'sprite1425' }, 'sprite1511').setDisplaySize(64, 64).on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                if (this.scene.isPaused('game')) {
                    this.scene.resume('game');
                } else {
                    this.scene.pause('game');
                }
            }
        });

        new Button(this, this.cameras.main.width - 36 * 3, 36, { default: 'sprite1372', hover: 'sprite1389', active: 'sprite1407', activeHover: 'sprite1425' }, 'sprite1445').setDisplaySize(64, 64).on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            console.log('settings');
        });

        this.scene.get('game').events
            .on('updateHealth', (health: number) => {
                if (this.healthText) {
                    this.healthText.updateText(health.toString());
                }
            })
            .on('updateMoney', (money: number) => {
                if (this.moneyText) {
                    this.moneyText.updateText(money.toString());
                }
            })
            .on('updateWave', (wave: number) => {
                if (this.waveText) {
                    this.waveText.updateText(`WAVE ${wave}`);
                    this.waveText.setPosition(this.cameras.main.centerX - this.waveText.width / 2, 38);
                }
            });
    }

    public update () {

    }
}