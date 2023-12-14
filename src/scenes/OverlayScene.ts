export default class OverlayScene extends Phaser.Scene {
    constructor () {
        super({ key: 'OverlayScene', active: true, visible: true });
    }

    public preload () {

    }

    public create () {
        this.add.text(512, 256, 'Overlay Scene', { fontSize: '64px', color: '#fff', backgroundColor: '#000' }).setOrigin(0.5).setDepth(1000);
    }

    public update () {

    }
}