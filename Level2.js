import Phaser from "phaser";

const musicConfig = {
    mute: false,
    volume: 0.2,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0,
};

const coinConfig = {
    mute: false,
    volume: 0.3,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: false,
    delay: 0
}
//music
let coinNoise
//sprites
let blueDino;
let capybara,
    capybara2,
    capybara3,
    capybara4,
    capybara5,
    capybara6,
    capybara7,
    capybara8;
let coin1, coin2, coin3;
//keyboard check
let cursors;
let shiftKey;
//tilemap
let deathBlocks;
let exit;
let capybaraStopper;
//counter
let staminabar = 600;
let jumptimer = 0;
let capybaraflip = 80;
let capybaraflip2 = 80;
let capybaraflip3 = 80;
let capybaraflip4 = 80;
let capybaraflip5 = 80;
let capybaraflip6 = 80;
let capybaraflip7 = 80;
let capybaraflip8 = 80;
let numberOfCoins = 0;
let numberOfDeaths;
//text
let score;
let staminatext;
let levelText;
let deathText;
//checkers
let staminatimeout = false;
let timeout = false;
let canJump;
let chosenThis;

class Level2 extends Phaser.Scene {
    constructor() {
        super("secondLevel");
    }
    preload() {
        this.load.audio('coinNoise', './assets/coinSound.mp3')
        //load sprites
        numberOfDeaths = localStorage.getItem("Deaths");
        this.load.spritesheet("capybara", "./assets/Capybara.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("idlecoin", "./assets/coin.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("idle", "./assets/Char.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        this.load.image("base_tiles", "./assets/level2/tiles2.png");
        this.load.tilemapTiledJSON("tilemap2", "./assets/level2/Level2.json");
    }

    create() {
        //music
        chosenThis = this;

        //tileset
        const map2 = this.make.tilemap({ key: "tilemap2" });
        const tileset = map2.addTilesetImage("base_tiles", "base_tiles");
        const tilelayer = map2.createLayer("Collide", tileset);
        const detailLayer = map2.createLayer("Details", tileset);
        deathBlocks = map2.createLayer("DeathBlocks", tileset);
        exit = map2.createLayer("Exit", tileset);
        capybaraStopper = map2.createLayer("CapybaraCharles", tileset);

        //check
        cursors = this.input.keyboard.createCursorKeys();
        shiftKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SHIFT
        );

        //sprite physics
        blueDino = this.physics.add.sprite(90, 80, "idle");
        blueDino.setSize(14, 16);
        blueDino.setScale(1);
        if (true) {
            capybara = this.physics.add.sprite(1300, 100, "capybara");
            capybara.setVelocityX(capybaraflip);
            capybara.setSize(58, 45);
            capybara.setScale(0.3);
            //215, 184
            capybara2 = this.physics.add.sprite(215, 184, "capybara");
            capybara2.setVelocityX(capybaraflip);
            capybara2.setSize(58, 45);
            capybara2.setScale(0.3);
            //635, 224
            capybara3 = this.physics.add.sprite(635, 224, "capybara");
            capybara3.setVelocityX(capybaraflip);
            capybara3.setSize(58, 45);
            capybara3.setScale(0.3);
            //880, 152
            capybara4 = this.physics.add.sprite(880, 152, "capybara");
            capybara4.setVelocityX(capybaraflip);
            capybara4.setSize(58, 45);
            capybara4.setScale(0.3);
            //1064, 64
            capybara5 = this.physics.add.sprite(1064, 64, "capybara");
            capybara5.setVelocityX(capybaraflip);
            capybara5.setSize(58, 45);
            capybara5.setScale(0.3);
            //1446, 216
            capybara6 = this.physics.add.sprite(1446, 216, "capybara");
            capybara6.setVelocityX(capybaraflip);
            capybara6.setSize(58, 45);
            capybara6.setScale(0.3);
            //1540, 216
            capybara7 = this.physics.add.sprite(1540, 216, "capybara");
            capybara7.setVelocityX(capybaraflip);
            capybara7.setSize(58, 45);
            capybara7.setScale(0.3);
            //1635, 216
            capybara8 = this.physics.add.sprite(1635, 216, "capybara");
            capybara8.setVelocityX(capybaraflip);
            capybara8.setSize(58, 45);
            capybara8.setScale(0.3);
        }

        coin1 = this.physics.add
            .sprite(645, 215, "idlecoin")
            .setImmovable(true);
        coin1.body.setAllowGravity(false);
        coin1.setScale(0.1);

        coin2 = this.physics.add.sprite(1068, 0, "idlecoin").setImmovable(true);
        coin2.body.setAllowGravity(false);
        coin2.setScale(0.1);

        coin3 = this.physics.add
            .sprite(1550, 100, "idlecoin")
            .setImmovable(true);
        coin3.body.setAllowGravity(false);
        coin3.setScale(0.1);

        //text
        score = this.add.text(0, 0, `Coins: 0`, {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        staminatext = this.add.text(0, 0, `Stamina: 100`, {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        levelText = this.add.text(0, 0, "Level: 2", {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        deathText = this.add.text(0, 0, `Deaths: ${numberOfDeaths}`, {
            fontSize: "8px",
            fill: "#FFFFFF",
        });

        this.cameras.main.startFollow(blueDino, true, 0.05, 0.05);

        this.anims.create({
            key: "idle",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", {
                start: 1,
                end: 3,
            }),
        });
        this.anims.create({
            key: "run",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", {
                start: 6,
                end: 9,
            }),
        });

        this.anims.create({
            key: "sprint",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", {
                start: 18,
                end: 23,
            }),
        });

        this.anims.create({
            key: "jump",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", {
                start: 4,
                end: 5,
            }),
        });

        this.anims.create({
            key: "tired",
            frameRate: 0.1,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", {
                start: 14,
                end: 16,
            }),
        });

        this.anims.create({
            key: "coinidle",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idlecoin", {
                start: 1,
                end: 8,
            }),
        });

        this.anims.create({
            key: "capybara",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("capybara", {
                start: 72,
                end: 79,
            }),
        });

        this.physics.add.collider(blueDino, tilelayer, function () {
            canJump = true;
        });

        this.physics.add.collider(blueDino, deathBlocks, function () {
            numberOfDeaths++;
            deathText.setText(`Deaths: ${numberOfDeaths}`);
            blueDino.setX(90);
            blueDino.setY(80);
        });

        this.physics.add.overlap(blueDino, coin1, function () {
            numberOfCoins++;
            coinNoise = chosenThis.sound.add('coinNoise')
            coinNoise.play(coinConfig)
            score.setText(`Coins: ${numberOfCoins}`);
            coin1.disableBody(true, true);
        });
        this.physics.add.overlap(blueDino, coin2, function () {
            numberOfCoins++;
            coinNoise = chosenThis.sound.add('coinNoise')
            coinNoise.play(coinConfig)
            score.setText(`Coins: ${numberOfCoins}`);
            coin2.disableBody(true, true);
        });
        this.physics.add.overlap(blueDino, coin3, function () {
            numberOfCoins++;
            coinNoise = chosenThis.sound.add('coinNoise')
            coinNoise.play(coinConfig)
            score.setText(`Coins: ${numberOfCoins}`);
            coin3.disableBody(true, true);
        });

        const endFunc = () => {
            localStorage.setItem("Deaths", numberOfDeaths);
            this.scene.start("thirdLevel");
        };
        this.physics.add.collider(blueDino, exit, function () {
            if (numberOfCoins === 3) {
                endFunc();
            }
        });

        
        function addColliders(varname, capybaraflipper) {
            chosenThis.physics.add.collider(varname, tilelayer);
            chosenThis.physics.add.collider(
                capybaraStopper,
                varname,
                function () {
                    if (capybaraflipper === 80) {
                        varname.flipX = false;
                        varname.setVelocityX(capybaraflipper);
                        capybaraflipper = -80;
                    } else {
                        varname.flipX = true;
                        varname.setVelocityX(capybaraflipper);
                        capybaraflipper = 80;
                    }
                }
            );
            chosenThis.physics.add.overlap(blueDino, varname, function () {
                if (
                    blueDino.body.velocity.y > 100 ||
                    blueDino.body.velocity.y < -100
                ) {
                    varname.disableBody(true, true);
                    blueDino.setVelocityY(-90);
                } else {
                    staminatimeout = false;
                    timeout = false;
                    staminabar = 600;
                    numberOfDeaths++;
                    deathText.setText(`Deaths: ${numberOfDeaths}`);
                    blueDino.setX(90);
                    blueDino.setY(80);
                }
            });
            chosenThis.physics.add.collider(varname, tilelayer);
        }
        addColliders(capybara, capybaraflip);
        addColliders(capybara2, capybaraflip2);
        addColliders(capybara3, capybaraflip3);
        addColliders(capybara4, capybaraflip4);
        addColliders(capybara5, capybaraflip5);
        addColliders(capybara6, capybaraflip6);
        addColliders(capybara7, capybaraflip7);
        addColliders(capybara8, capybaraflip8);

        capybaraStopper.setCollisionBetween(0, 400);
        tilelayer.setCollisionBetween(0, 400);
        deathBlocks.setCollisionBetween(0, 400);
        exit.setCollisionBetween(0, 400);
    }

    update() {
        staminatext.setText(`Stamina: ${((staminabar / 600) * 100).toFixed()}`);
        if (staminabar !== 600) {
            staminabar++;
        }
        if (staminabar === 0) {
            //isMoving = false
            blueDino.setVelocityX(0);
            blueDino.setVelocityY(0);
            timeout = true;
            blueDino.anims.play("tired", true);
            staminatimeout = true;
        }
        if (staminatimeout === true) {
            if (staminabar === 60) {
                timeout = false;
            }
            if (staminabar === 120) {
                staminatimeout = false;
            }
        }
        jumptimer++;
        score.x = blueDino.body.position.x - 100;
        score.y = blueDino.body.position.y - 100;
        staminatext.x = blueDino.body.position.x - 100;
        staminatext.y = blueDino.body.position.y - 90;
        levelText.x = blueDino.body.position.x - 100;
        levelText.y = blueDino.body.position.y - 80;
        deathText.x = blueDino.body.position.x - 100;
        deathText.y = blueDino.body.position.y - 70;

        if (
            shiftKey.isDown &&
            cursors.right.isDown &&
            staminabar > 0 &&
            staminatimeout === false &&
            timeout === false
        ) {
            staminabar = staminabar - 4;
            blueDino.setVelocityX(160);
            blueDino.flipX = false;
            blueDino.anims.play("sprint", true);
        } else if (
            shiftKey.isDown &&
            cursors.left.isDown &&
            staminabar > 0 &&
            staminatimeout === false &&
            timeout === false
        ) {
            staminabar = staminabar - 4;
            blueDino.setVelocityX(-160);
            blueDino.flipX = true;
            blueDino.anims.play("sprint", true);
        } else if (cursors.right.isDown && timeout === false) {
            blueDino.flipX = false;
            blueDino.setVelocityX(90);
            blueDino.anims.play("run", true);
        } else if (cursors.left.isDown && timeout === false) {
            blueDino.flipX = true;
            blueDino.setVelocityX(-90);
            blueDino.anims.play("run", true);
        } else if (timeout === false) {
            blueDino.anims.play("idle", true);
            blueDino.setVelocityX(0);
        }
        if (cursors.up.isDown&& canJump && jumptimer > 30) {
            blueDino.anims.play("jump", true);
            blueDino.setVelocityY(-145);
            jumptimer = 0;
        }
        if (blueDino.y > 300) {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths++;
            deathText.setText(`Deaths: ${numberOfDeaths}`);
            blueDino.setX(90);
            blueDino.setY(70);
        }

        coin1.anims.play("coinidle", true);
        coin2.anims.play("coinidle", true);
        coin3.anims.play("coinidle", true);
        capybara.anims.play("capybara", true);
        capybara2.anims.play("capybara", true);
        capybara3.anims.play("capybara", true);
        capybara4.anims.play("capybara", true);
        capybara5.anims.play("capybara", true);
        capybara6.anims.play("capybara", true);
        capybara7.anims.play("capybara", true);
        capybara8.anims.play("capybara", true);

        canJump = false;
    }
}

export default Level2;
