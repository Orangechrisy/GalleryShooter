class level1 extends Phaser.Scene {
    constructor() {
        super("level1");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        this.playerSpeed = 15;
        this.magicBulletSpeed = 25;
        this.magicCooldown = 4;
        this.magicCooldownCounter = 0;

        this.bullets = [];

        this.timer = 0;

        this.lives = 3;
        this.livesMax = 3;

        this.score = 0;
        this.streak = 0;

        this.planes = [];
        this.planeBulletSpeed = 15;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets
        this.load.setPath("./assets/");

        this.load.image("tileset_packed", "tiles_packed.png"); // From Pixel Shmup
        this.load.tilemapTiledJSON("map", "Gallery_Landscape.json");

        this.load.image("magicalGirl", "magical_girl.png"); // From Tiny Dungeon
        this.load.image("wand", "wand.png"); // From Tiny Dungeon
        this.load.image("magic", "magic_bullet.png"); // From Micro Roguelike

        this.load.image("fullHeart", "heart_full.png"); // Both from Pixel platformer
        this.load.image("emptyHeart", "heart_empty.png");

        this.load.bitmapFont('publicPixel', 'publicPixel_0.png', 'publicPixel.fnt');

        // From Pixel Shmup
        this.load.image("smallPlane1", "plane_small_1.png");
        this.load.image("mediumPlane1", "plane_med_1.png"); 

        this.load.image("singleBullet", "bullet_single.png");
        this.load.image("doubleBullet", "bullet_double.png");
    }

    create() {
        let my = this.my;

        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.map = this.add.tilemap("map", 16, 16, 120, 40);
        this.tileset = this.map.addTilesetImage("tiles_packed", "tileset_packed");
        this.layer = this.map.createLayer("main-layer", this.tileset, 0, 0);

        this.scoreText = this.add.bitmapText(950, 50, "publicPixel", "Score:" + this.score).setOrigin(1);

        let emptyHeart = this.add.sprite(80, 40, "emptyHeart");
        emptyHeart.setScale(3);
        let emptyHeart2 = this.add.sprite(80 + emptyHeart.displayWidth, 40, "emptyHeart");
        emptyHeart2.setScale(3);
        let emptyHeart3 = this.add.sprite(80 + emptyHeart.displayWidth * 2, 40, "emptyHeart");
        emptyHeart3.setScale(3);
        //this.emptyHearts = [emptyHeart, emptyHeart2, emptyHeart3];
        let fullHeart = this.add.sprite(80, 40, "fullHeart");
        fullHeart.setScale(3);
        fullHeart.visible = false;
        let fullHeart2 = this.add.sprite(80 + fullHeart.displayWidth, 40, "fullHeart");
        fullHeart2.setScale(3);
        fullHeart2.visible = false;
        let fullHeart3 = this.add.sprite(80 + fullHeart.displayWidth * 2, 40, "fullHeart");
        fullHeart3.setScale(3);
        fullHeart3.visible = false;
        this.fullHearts = [fullHeart, fullHeart2, fullHeart3];

        let wandSprite = this.add.sprite(50, game.config.height/2 + 5, "wand");
        wandSprite.setScale(2);
        my.sprite.magicalGirl = new Player(this, 30, game.config.height/2, "magicalGirl", null, this.up, this.down, this.playerSpeed)
        my.sprite.magicalGirl.setScale(3);
        my.sprite.magicalGirl.bulletHelper = wandSprite;
        my.sprite.magicalGirl.setDepth(4);
        my.sprite.magicalGirl.bulletHelper.setDepth(5);
        

        // Player bullets
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
        my.sprite.magicBulletGroup.propertyValueSet("speed", this.magicBulletSpeed);
        my.sprite.magicBulletGroup.angle(45);
        my.sprite.magicBulletGroup.scaleXY(2, 2);

        // Enemy bullets
        my.sprite.planeBulletGroup = this.add.group({
            active: true,
            defaultKey: "singleBullet",
            maxSize: 200,
            runChildUpdate: true
            }
        )

        my.sprite.planeBulletGroup.createMultiple({
            classType: EnemyBullet,
            active: false,
            key: my.sprite.planeBulletGroup.defaultKey,
            repeat: my.sprite.planeBulletGroup.maxSize-1
        });
        my.sprite.planeBulletGroup.propertyValueSet("speed", this.planeBulletSpeed);
        my.sprite.planeBulletGroup.angle(-90);
        my.sprite.planeBulletGroup.scaleXY(1, 1);


        // Path setting
        this.small_path_1 = [
            930, -70,
            900, 330,
            700, 125,
            560, 295,
            360, 195,
            -50, 380,
            -200, 380
        ]
        this.small_path_1_curve = new Phaser.Curves.Spline(this.small_path_1);
        this.medium_path_1 = [
            920, 720,
            640, 475,
            815, 295,
            580, 115,
            300, 275,
            85, 495,
            0, 396,
            -200, 420
        ]
        this.medium_path_1_curve = new Phaser.Curves.Spline(this.medium_path_1);

        // plane group 1
        my.sprite.smallPlane1 = this.add.follower(this.small_path_1_curve, 0, 0, "smallPlane1");
        this.planeSetup(my.sprite.smallPlane1, this.small_path_1_curve, 2, 0, 0, 20, 15);
        my.sprite.smallPlane2 = this.add.follower(this.small_path_1_curve, 0, 0, "smallPlane1");
        this.planeSetup(my.sprite.smallPlane2, this.small_path_1_curve, 2, 40, 50, 20, 15);
        my.sprite.smallPlane3 = this.add.follower(this.small_path_1_curve, 0, 0, "smallPlane1");
        this.planeSetup(my.sprite.smallPlane3, this.small_path_1_curve, 2, 40, -50, 20, 15);
        my.sprite.smallPlane4 = this.add.follower(this.small_path_1_curve, 0, 0, "smallPlane1");
        this.planeSetup(my.sprite.smallPlane4, this.small_path_1_curve, 2, 40, 0, 20, 15);
        my.sprite.smallPlane5 = this.add.follower(this.small_path_1_curve, 0, 0, "smallPlane1");
        this.planeSetup(my.sprite.smallPlane5, this.small_path_1_curve, 2, 80, 0, 20, 15);
        my.sprite.smallPlane6 = this.add.follower(this.small_path_1_curve, 0, 0, "smallPlane1");
        this.planeSetup(my.sprite.smallPlane6, this.small_path_1_curve, 2, 120, 0, 20, 15);

        // plane group 2
        my.sprite.mediumPlane1 = this.add.follower(this.medium_path_1_curve, 0, 0, "mediumPlane1");
        this.planeSetup(my.sprite.mediumPlane1, this.medium_path_1_curve, 2, 0, 0, 70, 15);
        my.sprite.mediumPlane2 = this.add.follower(this.medium_path_1_curve, 0, 0, "mediumPlane1");
        this.planeSetup(my.sprite.mediumPlane2, this.medium_path_1_curve, 2, 40, 50, 70, 15);
        my.sprite.mediumPlane3 = this.add.follower(this.medium_path_1_curve, 0, 0, "mediumPlane1");
        this.planeSetup(my.sprite.mediumPlane3, this.medium_path_1_curve, 2, 40, -50, 70, 15);
        my.sprite.mediumPlane4 = this.add.follower(this.medium_path_1_curve, 0, 0, "mediumPlane1");
        this.planeSetup(my.sprite.mediumPlane4, this.medium_path_1_curve, 2, 80, 100, 70, 15);
        my.sprite.mediumPlane5 = this.add.follower(this.medium_path_1_curve, 0, 0, "mediumPlane1");
        this.planeSetup(my.sprite.mediumPlane5, this.medium_path_1_curve, 2, 80, -100, 70, 15);
        my.sprite.mediumPlane6 = this.add.follower(this.medium_path_1_curve, 0, 0, "mediumPlane1");
        this.planeSetup(my.sprite.mediumPlane6, this.medium_path_1_curve, 2, 80, 0, 70, 15);
        
    };

    planeSetup(plane, curve, scale, offsetX, offsetY, time, fireRate) {
        plane.curve = curve;
        plane.visible = false;
        plane.angle = -90;
        plane.setScale(scale);
        plane.offsetX = offsetX;
        plane.offsetY = offsetY;
        plane.time = time;
        plane.fireRate = fireRate;
        plane.fireRateCounter = 0;
        this.planes.push(plane);
    }

    // Collision Checker
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
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
        
        // First Plane
        for (let plane of this.planes) {
            if (this.timer == plane.time) {
                if (plane.curve.points.length > 0) {
                    plane.x = plane.curve.points[0].x + plane.offsetX;
                    plane.y = plane.curve.points[0].y + plane.offsetY;
                    plane.visible = true;
                    let obj =
                    {
                        from: 0,
                        to: 1,
                        delay: 0,
                        duration: 5000,
                        ease: 'Quad.easeIn',
                        repeat: 0,
                        rotateToPath: false
                    }
                    plane.startFollow(obj, 0)
                }
            }
            if (plane.x < 0) {
                if (this.lives > 0) {
                    this.lives--;
                }
                this.streak = 0;
                plane.destroy();
                this.planes.splice(this.planes.indexOf(plane), 1);
                continue;
            }

            if (plane.visible) {
                if (plane.fireRateCounter < 0) {
                    let bullet = my.sprite.planeBulletGroup.getFirstDead();
                    if (bullet != null) {
                        plane.fireRateCounter = plane.fireRate;
                        bullet.makeActive();
                        bullet.x = plane.x - (plane.displayWidth/2);
                        bullet.y = plane.y;
                    }
                }
                plane.fireRateCounter--;
            }
        }

        // Bullets colliding with player
        this.nearbyBullets = [];
        for (let bullet of my.sprite.planeBulletGroup.getChildren()) {
            if (bullet.x < 100) {
                this.nearbyBullets.push(bullet);
            }
        }
        for (let bullet of this.nearbyBullets) {
            if (bullet.active && this.collides(bullet, my.sprite.magicalGirl)) {
                bullet.makeInactive();
                if (this.lives > 0) {
                    this.lives--;
                }
                this.streak = 0;
            }
        }

        // Enemies colliding with magic/player
        for (let plane of this.planes) {
            if (this.collides(plane, my.sprite.magicalGirl)) {
                if (this.lives > 0) {
                    this.lives--;
                }
                this.streak = 0;
                plane.destroy();
                this.planes.splice(this.planes.indexOf(plane), 1);
                continue;
            }
            for (let magic of my.sprite.magicBulletGroup.getChildren()) {
                if (magic.active && this.collides(plane, magic)) {
                    plane.destroy();
                    this.planes.splice(this.planes.indexOf(plane), 1);
                    magic.makeInactive();
                }
            }
        }

        my.sprite.magicalGirl.update();

        // Map Scroll
        if (this.timer % 2) {
            if (-this.layer.x != 920) {
                this.layer.x -= 1;
            }
        }

        // Set Lives
        for (let i = 0; i < this.livesMax; i++) {
            this.fullHearts[i].visible = false;
        }
        for (let i = 0; i < this.lives; i++) {
            this.fullHearts[i].visible = true;
        }

        // Update Score
        this.scoreText.setText("Score:" + this.score);
    }

}