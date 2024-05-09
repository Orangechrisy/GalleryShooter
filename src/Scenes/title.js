class title extends Phaser.Scene {
    constructor() {
        super("title");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('publicPixel', 'publicPixel_0.png', 'publicPixel.fnt');
    }
    create() {
        this.add.bitmapText(game.config.width/2, game.config.height/2 - 50, "publicPixel", "Magical Girl\n     VS\n  The World", 50).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2, 3 * game.config.height/4, "publicPixel", "Press S to start", 32).setOrigin(0.5);
        this.add.bitmapText(20, 20, "publicPixel", "pretend this is a good title screen", 8).setOrigin(0);

        this.start = this.input.keyboard.addKey("S");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.start)) {
            this.scene.start("level1");
        }
    }
}