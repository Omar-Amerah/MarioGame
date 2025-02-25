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
//music
let backgroundMusic;
//sprites
let blueDino;
let chicken, chicken2, chicken3, chicken4
let chickenBoss
//keyboard check
let cursors;
let shiftKey;
//tilemap
let deathBlocks;
let exit;
let enemyStopper;
let contain
let tilelayer

//counter
let staminabar = 600;
let jumptimer = 0;
let chickenFlip = 100
let chickenFlip2 = 60
let chickenFlip3 = 50
let chickenFlip4 = 150

let numberOfCoins = 0;
let numberOfDeaths
let bossHealth
let score;
let staminatext;
let levelText;
let deathText;
//checkers
let staminatimeout = false;
let timeout = false;
let canJump;
let selectedThis
let collideradder = true
let activateboss = false
let attack = false
let bosslives = 300
let tick = 0;
let bossSpawn = false
let playerPosX
let playerPosY

let cold;

class Level6 extends Phaser.Scene {
    constructor() {
        super("sixthLevel");
    }
    preload() {
        //load sprites
        numberOfDeaths = localStorage.getItem('Deaths')
        this.load.spritesheet('littleChicken', './assets/level6/LittleChicken.png', {
            frameWidth: 32, 
            frameHeight: 32
        })

        this.load.spritesheet('bossBoy', './assets/level6/Bossboy.png', {
            frameWidth: 32,
            frameHeight: 32
        })
        this.load.spritesheet("idlecoin", "./assets/coin.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("idle", "./assets/Char.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        this.load.image("base_tiles", "./assets/level6/tiles6.png");
        this.load.tilemapTiledJSON("tilemap6", "./assets/level6/Level6.json");
    }

    create() {
        selectedThis = this
        //tileset
        const map6 = this.make.tilemap({ key: "tilemap6" });
        const tileset = map6.addTilesetImage("base_tiles", "base_tiles");
        tilelayer = map6.createLayer("Collide", tileset);
        const detailLayer = map6.createLayer("Details", tileset);
        contain = map6.createLayer('Contain', tileset)
        deathBlocks = map6.createLayer("DeathBlocks", tileset);
        exit = map6.createLayer("Exit", tileset);
        enemyStopper = map6.createLayer("Enemy Stopper", tileset);


        //check
        cursors = this.input.keyboard.createCursorKeys();
        shiftKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SHIFT
        );

        //sprite physics
        blueDino = this.physics.add.sprite(90, 270, "idle");
        blueDino.setSize(14, 16);
        blueDino.setScale(1);

        chicken = this.physics.add.sprite(822, 224, 'littleChicken')
        chicken.setScale(0.5)
        chicken.setVelocityX(chickenFlip)
        chicken.setSize(25, 25)
        chicken2 = this.physics.add.sprite(958, 224, 'littleChicken')
        chicken2.setScale(0.5)
        chicken2.setSize(25, 25)
        chicken2.setVelocityX(-60)
        chicken3 = this.physics.add.sprite(1100, 224, 'littleChicken')
        chicken3.setScale(0.5)
        chicken3.setSize(25, 25)
        chicken3.setVelocityX(chickenFlip3)
        chicken4 = this.physics.add.sprite(1227, 224, 'littleChicken')
        chicken4.setScale(0.5)
        chicken4.setSize(20, 20)
        chicken4.setVelocityX(-150)
        
        // chickenBoss = this.physics.add.sprite(1845, 50, 'bossBoy')
        // chickenBoss.setSize(25, 25)
        // chickenBoss.setScale(4)

        

        //text
        staminatext = this.add.text(0, 0, `Stamina: 100`, {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        levelText = this.add.text(0, 0, "Level: 6", {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        deathText = this.add.text(0, 0, `Deaths: ${numberOfDeaths}`, {
            fontSize: "8px",
            fill: "#FFFFFF",
        });
        bossHealth = this.add.text(0, 0,"", {
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
            key: 'chicken',
            frameRate: 4,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('littleChicken', {
                start: 1,
                end: 4
            })
        })
        
        this.anims.create({
            key: 'chickenBossWalk',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('bossBoy', {
                start: 1,
                end: 8
            })
        })

        this.anims.create({
            key: 'chickenBossSit',
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('bossBoy', {
                start: 10,
                end: 10
            })
        })
             

        this.physics.add.collider(blueDino, tilelayer, function () {
            canJump = true;
        });

        
        this.physics.add.collider(blueDino, deathBlocks, function () {
            numberOfDeaths++;
            deathText.setText(`Deaths: ${numberOfDeaths}`);
            blueDino.setX(90);
            blueDino.setY(270);
        });

        
        this.physics.add.overlap(chicken, blueDino, function () {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths ++
            deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.body.position.x = 90;
            blueDino.body.position.y = 270;
        })
        this.physics.add.overlap(chicken2, blueDino, function () {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths ++
            deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.body.position.x = 90;
            blueDino.body.position.y = 270;
        })
        this.physics.add.overlap(chicken3, blueDino, function () {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths ++
            deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.body.position.x = 90;
            blueDino.body.position.y = 270;
        })
        this.physics.add.overlap(chicken4, blueDino, function () {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths ++
            deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.body.position.x = 90;
            blueDino.body.position.y = 270;
        })

        this.physics.add.collider(chicken, tilelayer)
        this.physics.add.collider(chicken2, tilelayer)
        this.physics.add.collider(chicken3, tilelayer)
        this.physics.add.collider(chicken4, tilelayer)

        this.physics.add.collider(chicken, enemyStopper, function () {
            if (chickenFlip === 100) {
                chicken.flipX = true
                chicken.setVelocityX(chickenFlip)
                chickenFlip = -100
            } else {
                chicken.flipX = false
                chicken.setVelocityX(chickenFlip)
                chickenFlip = 100
            }
        })

        this.physics.add.collider(chicken2, enemyStopper, function () {
            if (chickenFlip2 === 60) {
                chicken2.flipX = true
                chicken2.setVelocityX(chickenFlip2)
                chickenFlip2 = -60
            } else {
                chicken2.flipX = false
                chicken2.setVelocityX(chickenFlip2)
                chickenFlip2 = 60
            }
        })

        this.physics.add.collider(chicken3, enemyStopper, function () {
            if (chickenFlip3 === 50) {
                chicken3.flipX = true
                chicken3.setVelocityX(chickenFlip3)
                chickenFlip3 = -50
            } else {
                chicken3.flipX = false
                chicken3.setVelocityX(chickenFlip3)
                chickenFlip3 = 50
            }
        })

        this.physics.add.collider(chicken4, enemyStopper, function () {
            if (chickenFlip4 === 150) {
                chicken4.flipX = true
                chicken4.setVelocityX(chickenFlip4)
                chickenFlip4 = -150
            } else {
                chicken4.flipX = false
                chicken4.setVelocityX(chickenFlip4)
                chickenFlip4 = 150
            }
        })


        const endFunc = () => {
            localStorage.setItem('Deaths', numberOfDeaths)
            this.scene.start("endGame");
        };
        this.physics.add.collider(blueDino, exit, function () {                             
            if (numberOfCoins === 0) {
                endFunc();
            }
        });

        

        

        
        enemyStopper.setCollisionBetween(0, 4000);
        tilelayer.setCollisionBetween(0, 4000);
        contain.setCollisionBetween(0, 4000);
        deathBlocks.setCollisionBetween(0, 4000);
        exit.setCollisionBetween(0, 4000);
    }

    update() {
        

        if (blueDino.body.position.x > 1440 && collideradder === true) {
            chickenBoss = selectedThis.physics.add.sprite(1845, 50, 'bossBoy')
            chickenBoss.setSize(25, 25)
            chickenBoss.setScale(4)
            collideradder = false
            bossSpawn = true
            cold = selectedThis.physics.add.collider(blueDino, contain)
            console.log("hello")
            bossHealth.setText(`Health: 100%`)

            selectedThis.physics.add.collider(tilelayer, chickenBoss)
            selectedThis.physics.add.collider(contain, chickenBoss)

            selectedThis.physics.add.collider(blueDino, chickenBoss, function(){
            if(attack === true)
            {
                bosslives--
                bossHealth.setText(`Health: ${((bosslives / 300) * 100).toFixed()}%`)
                
            }
            else{
                staminatimeout = false;
                timeout = false;
                staminabar = 600;
                blueDino.setX(1450)
                blueDino.setY(225)
                chickenBoss.setX(1845)
                chickenBoss.setY(50)
                numberOfDeaths ++
                deathText.setText(`Deaths: ${numberOfDeaths}`)
            }
            if(bosslives <= 0){
                cold.destroy()
                chickenBoss.disableBody(true, true)
            }
        })
            
        }
        if(bossSpawn === true)
        {
            tick++
            if (blueDino.body.position.x > chickenBoss.body.position.x) {
                chickenBoss.flipX = true
            } else chickenBoss.flipX = false
    
    
            if(tick === 100)
            {
                playerPosX = blueDino.body.position.x
                playerPosY = blueDino.body.position.y
                attack = true
            }
            else if (tick === 300) {
                chickenBoss.setVelocityX(playerPosX - chickenBoss.body.position.x) 
                chickenBoss.setVelocityY(-200)
                attack = false
            }
            else if (tick === 400)
            {
                tick = 0 
                attack = false
                chickenBoss.setVelocityX(0)
                chickenBoss.setVelocityY(300)
                
            }
    
            if (attack) {
                chickenBoss.anims.play('chickenBossSit', true)
            } else 
            {
                chickenBoss.anims.play('chickenBossWalk',true)
            }
    
        }

        


        staminatext.setText(`Stamina: ${((staminabar / 600) * 100).toFixed()}`);
        if (staminabar !== 600) {
            staminabar++;
        }
        if (staminabar === 0) {
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
        
        staminatext.x = blueDino.body.position.x - 100;
        staminatext.y = blueDino.body.position.y - 100;
        levelText.x = blueDino.body.position.x - 100;
        levelText.y = blueDino.body.position.y - 90;
        deathText.x = blueDino.body.position.x - 100;
        deathText.y = blueDino.body.position.y - 80;
        bossHealth.x = blueDino.body.position.x - 100;
        bossHealth.y = blueDino.body.position.y - 70;

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
        // && canJump && jumptimer > 30
        if (cursors.up.isDown && canJump && jumptimer > 30) {
            blueDino.anims.play("jump", true);
            blueDino.setVelocityY(-145);
            jumptimer = 0;
        }
        if (blueDino.y > 800) {
            staminatimeout = false;
            timeout = false;
            staminabar = 600;
            numberOfDeaths++;
            deathText.setText(`Deaths: ${numberOfDeaths}`);
            blueDino.setX(90);
            blueDino.setY(70);
        }

        chicken.anims.play('chicken', true)
        chicken2.anims.play('chicken', true)
        chicken3.anims.play('chicken', true)
        chicken4.anims.play('chicken', true)
 
        canJump = false;
    }
}

export default Level6;
