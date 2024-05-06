// from the BulletTime repo
class Player extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // upKey - key for moving up
    // downKey - key for moving down
    constructor(scene, x, y, texture, frame, upKey, downKey, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.up = upKey;
        this.down = downKey;
        this.playerSpeed = playerSpeed;

        scene.add.existing(this);

        return this;
    }

    update() {
        // Moving up
        if (this.up.isDown) {
            // Check to make sure the sprite can actually move left
            if (this.y > (this.displayHeight/2)) {
                this.y -= this.playerSpeed;
            }
        }

        // Moving down
        if (this.down.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.y < (game.config.height - (this.displayHeight/2))) {
                this.y += this.playerSpeed;
            }
        }
    }

}