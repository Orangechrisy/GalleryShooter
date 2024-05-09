class end extends Phaser.Scene {
    constructor() {
        super("end");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('publicPixel', 'publicPixel_0.png', 'publicPixel.fnt');
    }
    create() {
        this.add.bitmapText(game.config.width/2, game.config.height/2, "publicPixel", "GAME END", 50).setOrigin(0.5);
        this.add.bitmapText(game.config.width/2, 3 * game.config.height/4, "publicPixel", "Press T to go back to the title screen too", 16).setOrigin(0.5);
        this.add.bitmapText(980, 580, "publicPixel", "pretend this is a good end screen", 8).setOrigin(1);

        this.start = this.input.keyboard.addKey("T");
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.start)) {
            this.scene.start("title");
        }
    }
}