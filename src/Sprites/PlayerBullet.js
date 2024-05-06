class PlayerBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        return this;
    }

    update() {
        if (this.active) {
            this.x += this.speed;
            if (this.x > (game.config.width + this.displayWidth/2)) {
                this.makeInactive();
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }

}