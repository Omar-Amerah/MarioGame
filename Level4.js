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
let backgroundMusic;
let coinNoise
//sprites
let blueDino;
let snake;
let scorpion, scorpion2, scorpion3
let vulture, vulture2
let coin1, coin2, coin3;
//keyboard check
let cursors;
let shiftKey;
//tilemap
let deathBlocks;
let exit;
let enemyStopper;

//counter
let staminabar = 600;
let jumptimer = 0;
let scorpionFlip = 100;
let scorpionFlip2 = 100;
let scorpionFlip3 = 100;
let vultureFlip = 50;
let vultureFlip2 = 50;
let tick = 0;

let numberOfCoins = 0;
let numberOfDeaths
//text
let score;
let staminatext;
let levelText;
let deathText;
//checkers
let staminatimeout = false;
let timeout = false;
let canJump;
let chosenThis

class Level4 extends Phaser.Scene {
    constructor() {
        super("fourthLevel");
    }
    preload() {
        this.load.audio('coinNoise', './assets/coinSound.mp3')
        //load sprites
        numberOfDeaths = localStorage.getItem('Deaths')
        this.load.spritesheet("snake", "./assets/level4/Snake_attack.png", {
            frameWidth: 48,
            frameHeight: 24,
        });
        this.load.spritesheet('scorpion', './assets/level4/Scorpion.png', {
            frameWidth: 48,
            frameHeight: 48,
        })
        this.load.spritesheet('vulture', './assets/level4/Vulture.png', {
            frameWidth: 48,
            frameHeight: 48,
        })
        this.load.spritesheet("idlecoin", "./assets/coin.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("idle", "./assets/Char.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        this.load.image("base_tiles", "./assets/level4/tiles4.png");
        this.load.tilemapTiledJSON("tilemap4", "./assets/level4/Level4.json");
    }

    create() {
        //tileset
        chosenThis = this
        const map4 = this.make.tilemap({ key: "tilemap4" });
        const tileset = map4.addTilesetImage("base_tiles", "base_tiles");
        const tilelayer = map4.createLayer("Collide", tileset);
        const detailLayer = map4.createLayer("Details", tileset);
        deathBlocks = map4.createLayer("DeathBlocks", tileset);
        exit = map4.createLayer("Exit", tileset);
        enemyStopper = map4.createLayer("enemyStopper", tileset);
        // 1, 2, 2, 2, 1, 2, 1


        //check
        cursors = this.input.keyboard.createCursorKeys();
        shiftKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SHIFT
        );

        //sprite physics
        blueDino = this.physics.add.sprite(90, 150, "idle");
        blueDino.setSize(14, 16);
        blueDino.setScale(1);

        snake = this.physics.add.sprite(220, 192, "snake");
        snake.body.setSize(snake.width - 20, snake.height - 5);
        snake.body.setOffset(20, 5);

        scorpion = this.physics.add.sprite(300, 230, 'scorpion')
        scorpion.body.setSize(scorpion.width - 5, scorpion.height - 20)
        scorpion.body.setOffset(10, 20)
        scorpion.setVelocityX(scorpionFlip)
        
        scorpion2 = this.physics.add.sprite(1550, -10, 'scorpion')
        scorpion2.body.setSize(scorpion.width - 5, scorpion.height - 30)
        scorpion2.body.setOffset(10, 20)
        scorpion2.setVelocityX(scorpionFlip2)

        scorpion3 = this.physics.add.sprite(2160, 264, 'scorpion')
        scorpion3.body.setSize(scorpion.width - 5, scorpion.height - 30)
        scorpion3.body.setOffset(10, 20)
        scorpion3.setVelocityX(scorpionFlip3)
        
        vulture = this.physics.add.sprite(720,170, 'vulture')
        vulture.body.setSize(vulture.width - 8, vulture.height - 15)
        vulture.body.setOffset(10, 10)
        vulture.body.setAllowGravity(false)
        vulture.setVelocityX(vultureFlip)
        
        vulture2 = this.physics.add.sprite(1800,100, 'vulture')
        vulture2.body.setSize(vulture2.width - 8, vulture2.height - 15)
        vulture2.body.setOffset(10, 10)
        vulture2.body.setAllowGravity(false)
        vulture2.setVelocityX(vultureFlip2)
        

        coin1 = this.physics.add
            .sprite(810, 110, "idlecoin")
            .setImmovable(true);
        coin1.body.setAllowGravity(false);
        coin1.setScale(0.6);

        coin2 = this.physics.add
            .sprite(1580, -30, "idlecoin")
            .setImmovable(true);
        coin2.body.setAllowGravity(false);
        coin2.setScale(0.6);
//2110, 2255
        coin3 = this.physics.add
            .sprite(2175, 150, "idlecoin")
            .setImmovable(true);
        coin3.body.setAllowGravity(false);
        coin3.setScale(0.6);

        //text
        score = this.add.text(0, 0, `Coins: 0`, {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        staminatext = this.add.text(0, 0, `Stamina: 100`, {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        levelText = this.add.text(0, 0, "Level: 4", {
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
            key: "snakeIdle",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("snake", {
                start: 6,
                end: 8,
            }),
        });

        this.anims.create({
            key: "snakeAttack",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("snake", {
                start: 9,
                end: 12,
            }),
        });

        this.anims.create({
            key: 'scorpion',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('scorpion', {
                start: 1,
                end: 4
            })
        })
        this.anims.create({
            key: 'vulture',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('vulture', {
                start: 1,
                end: 4
            })
        })
        

        this.physics.add.collider(blueDino, tilelayer, function () {
            canJump = true;
        });

        this.physics.add.collider(scorpion, tilelayer)
        this.physics.add.collider(scorpion, enemyStopper, function () {
            if (scorpionFlip === 100) {
                scorpion.body.setOffset(10, 20)
                scorpion.flipX = true
                scorpion.setVelocityX(scorpionFlip)
                scorpionFlip = -100
            } else {
                scorpion.body.setOffset(0, 20)
                scorpion.flipX = false
                scorpion.setVelocityX(scorpionFlip)
                scorpionFlip = 100
            }
        })

        this.physics.add.overlap(scorpion, blueDino, function () {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths++            
            deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.body.position.x = 90;
            blueDino.body.position.y = 150;
        })

        //////
        
        this.physics.add.collider(scorpion2, tilelayer)
        this.physics.add.collider(scorpion2, enemyStopper, function () {
            if (scorpionFlip2 === 100) {
                scorpion2.body.setOffset(10, 30)
                scorpion2.flipX = true
                scorpion2.setVelocityX(scorpionFlip2)
                scorpionFlip2 = -100
            } else {
                scorpion2.body.setOffset(0, 30)
                scorpion2.flipX = false
                scorpion2.setVelocityX(scorpionFlip2)
                scorpionFlip2 = 100
            }
        })

        this.physics.add.overlap(scorpion2, blueDino, function () {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths++            
                deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.body.position.x = 90;
            blueDino.body.position.y = 150;
        })

        this.physics.add.collider(scorpion3, tilelayer)
        this.physics.add.collider(scorpion3, enemyStopper, function () {
            if (scorpionFlip3 === 100) {
                scorpion3.body.setOffset(10, 30)
                scorpion3.flipX = true
                scorpion3.setVelocityX(scorpionFlip3)
                scorpionFlip3 = -100
            } else {
                scorpion3.body.setOffset(0, 30)
                scorpion3.flipX = false
                scorpion3.setVelocityX(scorpionFlip3)
                scorpionFlip3 = 100
            }
        })

        this.physics.add.overlap(scorpion2, blueDino, function () {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths++            
            deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.body.position.x = 90;
            blueDino.body.position.y = 150;
        })

        this.physics.add.collider(snake, tilelayer);
        this.physics.add.overlap(snake, blueDino, function () {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths++            
            deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.body.position.x = 90;
            blueDino.body.position.y = 150;
        });
        this.physics.add.collider(vulture, tilelayer);
        
        this.physics.add.collider(vulture, enemyStopper, function () {
            if (vultureFlip === 50) {
                vulture.flipX = true
                vulture.setVelocityX(vultureFlip)
                vultureFlip = -50
            } else {
                vulture.flipX = false
                vulture.setVelocityX(vultureFlip)
                vultureFlip = 50
            }
        })

        this.physics.add.collider(vulture2, tilelayer);
        
        this.physics.add.collider(vulture2, enemyStopper, function () {
            if (vultureFlip2 === 50) {
                vulture2.flipX = true
                vulture2.setVelocityX(vultureFlip2)
                vultureFlip2 = -50
            } else {
                vulture2.flipX = false
                vulture2.setVelocityX(vultureFlip2)
                vultureFlip2 = 50
            }
        })
        this.physics.add.overlap(blueDino, vulture, function() {
                blueDino.setVelocityY(-180)
        })

        this.physics.add.overlap(blueDino, vulture2, function() {
            blueDino.setVelocityY(-180)
        })
            
        
        this.physics.add.collider(blueDino, deathBlocks, function () {
            numberOfDeaths++;
            deathText.setText(`Deaths: ${numberOfDeaths}`);
            blueDino.setX(90);
            blueDino.setY(150);
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
            this.scene.start("sixthLevel");
        };
        this.physics.add.collider(blueDino, exit, function () {
            if (numberOfCoins === 3) {
                localStorage.setItem('Deaths', numberOfDeaths)
                endFunc();
            }
        });

        //ENEMY NAME.setCollisionBetween(0,4000)
        enemyStopper.setCollisionBetween(0, 4000);
        tilelayer.setCollisionBetween(0, 4000);
        deathBlocks.setCollisionBetween(0, 4000);
        exit.setCollisionBetween(0, 4000);
    }

    update() {
        tick++;

        if (tick < 200) {
            snake.anims.play("snakeIdle", true);
            snake.body.setSize(snake.width - 20, snake.height - 5);
            snake.body.setOffset(20, 5);
        } else if (tick < 349) {
            snake.anims.play("snakeAttack", true);
            snake.body.setOffset(0, 5);
            snake.body.setSize(snake.width, snake.height - 5);
        } else if (tick === 350) {
            tick = 0;
        }

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
        //&& canJump && jumptimer > 30
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
            blueDino.setY(150);
        }

        coin1.anims.play("coinidle", true);
        coin2.anims.play("coinidle", true);
        coin3.anims.play("coinidle", true);

        canJump = false;
        vulture.anims.play('vulture', true)
        vulture2.anims.play('vulture', true)
        scorpion.anims.play('scorpion', true)
        scorpion2.anims.play('scorpion', true)
        scorpion3.anims.play('scorpion', true)
    }
}

export default Level4;
