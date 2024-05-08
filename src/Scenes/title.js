class title extends Phaser.Scene {
    constructor() {
        super("title");
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.bitmapFont('publicPixel', 'publicPixel_0.png', 'publicPixel.fnt');
    }
    create() {
        this.scoreText = this.add.bitmapText(game.config.width/2, game.config.height/2, "publicPixel", "Magical Girl\n     VS\n  The World", 50).setOrigin(0.5);
        this.scoreText = this.add.bitmapText(game.config.width/2, 3 * game.config.height/4, "publicPixel", "Press S to start", 32).setOrigin(0.5);
        this.start = this.input.keyboard.addKey("S");

        document.getElementById('description').innerHTML = 'W: up // S: down // Space: fire'
    }
    update() {
        if (Phaser.Input.Keyboard.JustDown(this.start)) {
            //var level1 = this.scene.get('level1');
            //level1.scene.restart();
            this.scene.start("level1");
        }
    }
}