class level1 extends Phaser.Scene {
    constructor() {
        super("level1");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        this.playerSpeed = 15;
        this.bulletSpeed = 25;
        this.magicCooldown = 3;
        this.magicCooldownCounter = 0;

        this.bullets = [];

        this.timer = 0;

    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets
        this.load.setPath("./assets/");

        this.load.image("magicalGirl", "magical_girl.png"); // From Tiny Dungeon
        this.load.image("wand", "wand.png"); // From Tiny Dungeon
        this.load.image("magic", "magic_bullet.png"); // From Micro Roguelike

        // From Pixel Shmup
        this.load.image("smallPlane1", "plane_small_1.png");
        this.load.image("mediumPlane1", "plane_med_1.png"); 
    }

    create() {
        let my = this.my;

        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        let wandSprite = this.add.sprite(50, game.config.height/2 + 5, "wand");
        wandSprite.setScale(2);
        my.sprite.magicalGirl = new Player(this, 30, game.config.height/2, "magicalGirl", null, this.up, this.down, this.playerSpeed)
        my.sprite.magicalGirl.setScale(3);
        my.sprite.magicalGirl.bulletHelper = wandSprite;
        

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
            key: my.sprite.magicBulletGroup.defaultKey,
            repeat: my.sprite.magicBulletGroup.maxSize-1
        });
        my.sprite.magicBulletGroup.propertyValueSet("speed", this.bulletSpeed);
        my.sprite.magicBulletGroup.angle(45);
        my.sprite.magicBulletGroup.scaleXY(2, 2)

        this.small_path_1 = [
            930, -20,
            900, 330,
            700, 125,
            560, 295,
            360, 195,
            -50, 380
        ]
        this.small_path_1_curve = new Phaser.Curves.Spline(this.small_path_1);
        my.sprite.smallPlane1 = this.add.follower(this.small_path_1_curve, 10, 10, "smallPlane1");
        my.sprite.smallPlane1.visible = false;
        my.sprite.smallPlane1.angle = -90;
        my.sprite.smallPlane1.setScale(2);
    };

    planeGotToEnd(plane) {
        plane.destroy();
        // set health
    }

    update() {
        let my = this.my;
        this.magicCooldownCounter--;
        this.timer++;
        
        // Fire Magic Bullet
        if (this.space.isDown) {
            if (this.magicCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let magic = my.sprite.magicBulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (magic != null) {
                    this.magicCooldownCounter = this.magicCooldown;
                    magic.makeActive();
                    magic.x = my.sprite.magicalGirl.x + (my.sprite.magicalGirl.displayWidth/2) + 5;
                    magic.y = my.sprite.magicalGirl.y;
                }
            }
        }
        
        if (this.timer == 20) {
            if (this.small_path_1_curve.points.length > 0) {
                my.sprite.smallPlane1.x = this.small_path_1_curve.points[0].x;
                my.sprite.smallPlane1.y = this.small_path_1_curve.points[0].y;
                my.sprite.smallPlane1.visible = true;
                let obj =
                {
                    from: 0,
                    to: 1,
                    delay: 0,
                    duration: 4000,
                    ease: 'Quad.easeIn',
                    repeat: 0,
                    rotateToPath: false,
                    onComplete: this.planeGotToEnd(my.sprite.smallPlane1)
                }
                my.sprite.smallPlane1.startFollow(obj, 0)
            }
        }

        my.sprite.magicalGirl.update();
    }

}