class EnemyBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, speed) {        
        super(scene, x, y, texture, frame);
        this.visible = true;
        this.active = true;
        this.speed = speed;
        return this;
    }

    update() {
        if (this.active) {
            this.x -= this.speed;
            if (this.x < -(this.displayWidth/2)) {
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