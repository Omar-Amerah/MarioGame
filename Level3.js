import Phaser from "phaser";

const musicConfig = {
    mute: false,
    volume: 0.2,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0
}

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
let backgroundMusic
let coinNoise
//sprites
let blueDino;
let penguin                                                
let coin1,coin2,coin3; 
//keyboard check
let cursors;
let shiftKey;
//tilemap
let deathBlocks
let exit
let penguinStopper
//counter
let staminabar = 600;
let jumptimer = 0
let penguinFlip = 80

let numberOfCoins = 0
let numberOfDeaths;
//text
let score;
let staminatext;
let levelText
let deathText
//checkers
let staminatimeout = false; 
let timeout = false
let canJump;
let chosenThis




class Level3 extends Phaser.Scene {
    constructor() {
        super("thirdLevel");
        
    }
    preload() {
        //load sprites
        this.load.audio('coinNoise', './assets/coinSound.mp3')
        numberOfDeaths = localStorage.getItem('Deaths')
        this.load.spritesheet("penguin", "./assets/level3/penguin.png", {
            frameWidth: 128,
            frameHeight: 128 
        })
        this.load.spritesheet("idlecoin", "./assets/coin.png", {
            frameWidth: 16,
            frameHeight: 16 
        })
        this.load.spritesheet("idle", "./assets/Char.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        this.load.image("base_tiles", "./assets/level3/tiles3.png")
        this.load.tilemapTiledJSON("tilemap3", "./assets/level3/Level3.json")
    }
    
    create() {
        //music
        chosenThis = this
        //tileset
        const map3 = this.make.tilemap({ key: "tilemap3" })
        const tileset = map3.addTilesetImage('base_tiles', 'base_tiles')
        const tilelayer = map3.createLayer('Collide', tileset)
        const detailLayer= map3.createLayer("Details", tileset)
        deathBlocks = map3.createLayer('DeathBlocks', tileset)
        exit = map3.createLayer('Exit', tileset)
        penguinStopper = map3.createLayer('PenguinStopper', tileset)
        // 1, 2, 2, 2, 1, 2, 1
        
        //check
        cursors = this.input.keyboard.createCursorKeys();
        shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        
        //sprite physics
        blueDino = this.physics.add.sprite(70, 90, "idle");
        penguin = this.physics.add.sprite(1600, 90, "penguin")
        penguin.setScale(0.15)
        penguin.setSize(120, 80, true)
        penguin.setVelocityX(penguinFlip)
        blueDino.setSize(14, 16)
        blueDino.setScale(1);
        

        coin1 = this.physics.add.sprite(725, 210, 'idlecoin').setImmovable(true)
        coin1.body.setAllowGravity(false);
        coin1.setScale(0.1)
    
        coin2 = this.physics.add.sprite(1615, 120, 'idlecoin').setImmovable(true)
        coin2.body.setAllowGravity(false);
        coin2.setScale(0.1)
    
        coin3 = this.physics.add.sprite(1250, 155, 'idlecoin').setImmovable(true)
        coin3.body.setAllowGravity(false);
        coin3.setScale(0.1)



        //text
        score = this.add.text(0,0, `Coins: 0`, { fontSize: '8px', fill: '#FFFFFF' })
        staminatext = this.add.text(0,0, `Stamina: 100`, { fontSize: '8px', fill: '#FFFFFF' })
        levelText = this.add.text(0, 0, 'Level: 3', { fontSize: '8px', fill: '#FFFFFF' })
        deathText = this.add.text(0, 0, `Deaths: ${numberOfDeaths}`, { fontSize: '8px', fill: '#FFFFFF' })
        
        
        this.cameras.main.startFollow(blueDino, true, 0.05, 0.05)
    
        this.anims.create({
            key: "idle",
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", { start: 1, end: 3 }),
        });
        this.anims.create({
            key: "run",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", { start: 6, end: 9 }),
        });
    
        this.anims.create({
            key: "sprint",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", { start: 18, end: 23 }),
        });

        this.anims.create({
            key: "jump",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", { start: 4, end: 5 }),
        });

        this.anims.create({
            key: "tired",
            frameRate: 0.1,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idle", { start: 14, end: 16 }),
        });

        this.anims.create({
            key: "coinidle",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("idlecoin", { start: 1, end: 8 }),
        });

        this.anims.create({
            key: "penguin",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("penguin", { start: 22, end: 23 }),
        });
        

        this.physics.add.collider(penguin, tilelayer)
    
        this.physics.add.collider(blueDino, tilelayer , function () {
            canJump = true;
        });

        this.physics.add.collider(penguin, penguinStopper, function () {
            if (penguinFlip === 80) {
                penguin.flipX = false
                penguin.setVelocityX(penguinFlip)
                penguinFlip = -80
            } else {
                penguin.flipX = true
                penguin.setVelocityX(penguinFlip)
                penguinFlip = 80
            }
        })
    
        
        
        this.physics.add.collider(blueDino, deathBlocks, function() {
            numberOfDeaths++
            deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.setX(70);
            blueDino.setY(90)
        })


        this.physics.add.overlap(blueDino, penguin, function() {
            
            if (blueDino.body.velocity.y > 100 || blueDino.body.velocity.y < -100)
            {
                penguin.disableBody(true, true)
                blueDino.setVelocityY(-90)
            }
            else
            {
                staminatimeout = false
                timeout = false
                staminabar = 600;
                numberOfDeaths++
                deathText.setText(`Deaths: ${numberOfDeaths}`)
                blueDino.setX(70);
                blueDino.setY(90)
            }
            
        })
    
        this.physics.add.overlap(blueDino, coin1, function() {
            numberOfCoins++
            coinNoise = chosenThis.sound.add('coinNoise')
            coinNoise.play(coinConfig)
            score.setText(`Coins: ${numberOfCoins}`)
            coin1.disableBody(true, true)
        })
        this.physics.add.overlap(blueDino, coin2, function() {
            numberOfCoins++
            coinNoise = chosenThis.sound.add('coinNoise')
            coinNoise.play(coinConfig)
            score.setText(`Coins: ${numberOfCoins}`)
            coin2.disableBody(true, true)
        })
        this.physics.add.overlap(blueDino, coin3, function() {
            numberOfCoins++
            coinNoise = chosenThis.sound.add('coinNoise')
            coinNoise.play(coinConfig)
            score.setText(`Coins: ${numberOfCoins}`)
            coin3.disableBody(true, true)
        })


        const endFunc =  () => {
            this.scene.start('fourthLevel')
        }
        this.physics.add.collider(blueDino, exit, function() {
            
            if (numberOfCoins === 3) {
                localStorage.setItem('Deaths', numberOfDeaths)
                endFunc()                  
            }
        })
        
        
        
    
        penguinStopper.setCollisionBetween(0,4000)
        tilelayer.setCollisionBetween(0,4000)
        deathBlocks.setCollisionBetween(0,4000)
        exit.setCollisionBetween(0, 4000)
    }
    
    update() {
        

        staminatext.setText(`Stamina: ${(staminabar/600 * 100).toFixed()}`)
        if(staminabar !== 600)
        {
            staminabar ++;
        }
        if(staminabar === 0){
            //isMoving = false
            blueDino.setVelocityX(0)
            blueDino.setVelocityY(0)
            timeout = true
            blueDino.anims.play("tired", true);
            staminatimeout = true
        }
        if(staminatimeout === true)
        {
            if(staminabar === 60)
            {
                timeout = false
            }
            if(staminabar === 120)
            {
                staminatimeout = false
            }
        }
        jumptimer ++;
        score.x = blueDino.body.position.x - 100; 
        score.y = blueDino.body.position.y - 100;
        staminatext.x = blueDino.body.position.x - 100; 
        staminatext.y = blueDino.body.position.y - 90;
        levelText.x = blueDino.body.position.x - 100;
        levelText.y = blueDino.body.position.y -80;
        deathText.x = blueDino.body.position.x - 100;
        deathText.y = blueDino.body.position.y -70;
    
        if (shiftKey.isDown && cursors.right.isDown && staminabar > 0 && staminatimeout === false && timeout ===false) {
            console.log(blueDino.body.position.x, blueDino.body.position.y)
            staminabar = staminabar - 4
            blueDino.setVelocityX(160);
            blueDino.flipX = false;
            blueDino.anims.play("sprint", true);
        } else if (shiftKey.isDown && cursors.left.isDown && staminabar > 0 && staminatimeout === false && timeout ===false) {
            staminabar = staminabar - 4
            blueDino.setVelocityX(-160);
            blueDino.flipX = true;
            blueDino.anims.play("sprint", true);
        } else if (cursors.right.isDown&& timeout ===false) {
            blueDino.flipX = false;
            blueDino.setVelocityX(90);
            blueDino.anims.play("run", true);
        } else if (cursors.left.isDown && timeout === false) {
            blueDino.flipX = true;
            blueDino.setVelocityX(-90);
            blueDino.anims.play("run", true);
        } else if(timeout === false){
            blueDino.anims.play("idle", true);
            blueDino.setVelocityX(0);
        }
        //&& canJump && jumptimer > 30
        if (cursors.up.isDown&& canJump && jumptimer > 30) {
            blueDino.anims.play("jump", true);
            blueDino.setVelocityY(-145);
            jumptimer = 0
        }
        if(blueDino.y > 300)
        {
            staminatimeout = false
            timeout = false
            staminabar = 600;
            numberOfDeaths++
            deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.setX(90);
            blueDino.setY(70)
        }


        coin1.anims.play("coinidle", true)
        coin2.anims.play("coinidle", true)
        coin3.anims.play("coinidle", true)
        penguin.anims.play('penguin', true)
    
        canJump = false;
    }
}


export default Level3;
