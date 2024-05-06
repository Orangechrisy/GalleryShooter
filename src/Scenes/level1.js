class level1 extends Phaser.Scene {
    constructor() {
        super("theBattle");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        this.playerSpeed = 5;
        this.bulletSpeed = 7;
        this.magicCooldown = 4;
        this.magicCooldownCounter = 0;

        this.bullets = [];

    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets
        this.load.setPath("./assets/");

        this.load.image("magicalGirl", "magical_girl.png"); // From Tiny Dungeon
        this.load.image("wand", "wand.png"); // From Tiny Dungeon
        this.load.image("magic", "magic_bullet.png"); // From Micro Roguelike
    }

    create() {
        let my = this.my;

        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.magicalGirl = new Player(this, game.config.width + 30, game.config.height/2, "magicalGirl", null, this.up, this.down, this.playerSpeed)
        my.sprite.magicalGirl.addChild(game.make.sprite(10, 0, "wand")); // So wand stays attached

        my.sprite.magicBulletGroup = this.add.group({
            active: true,
            defaultKey: "magic",
            maxSize: 30,
            runChildUpdate: true
            }
        )

        my.sprite.magicBulletGroup.createMultiple({
            classType: PlayerBullet,
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });
        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);
    }

    update() {
        let my = this.my;
        this.magicCooldownCounter--;
        
        // Fire Magic Bullet
        if (this.space.isDown) {
            if (this.magicCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let magic = my.sprite.magicBulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (magic != null) {
                    this.bulletCooldownCounter = this.bulletCooldown;
                    magic.makeActive();
                    magic.x = my.sprite.magicalGirl.x + (my.sprite.magicalGirl.displayWidth/2);
                    magic.y = my.sprite.magicalGirl.y;
                }
            }
        }
        
        my.sprite.magicalGirl.update();
    }

}