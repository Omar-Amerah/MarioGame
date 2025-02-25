import Phaser from "phaser";



const musicConfig = {
    mute: false,
    volume: 0.02,
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
let capybara;
let coin1,coin2,coin3;
//keyboard check
let cursors;
let shiftKey;
//tilemap
let deathBlocks
let exit
let capybaraStopper
//counter
let staminabar = 600;
let jumptimer = 0
let capybaraflip = 80
let numberOfCoins = 0
let numberOfDeaths = 0
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
localStorage.removeItem('Deaths')



class Level1 extends Phaser.Scene {
    constructor() {
        super("firstLevel");
        
    }
    preload() {
        //load sprites
        this.load.audio('coinNoise', './assets/coinSound.mp3')
        this.load.audio('background', './assets/background.mp3')
        this.load.spritesheet("capybara", "./assets/Capybara.png", {
            frameWidth: 64,
            frameHeight: 64 
        })
        this.load.spritesheet("idlecoin", "./assets/coin.png", {
            frameWidth: 16,
            frameHeight: 16 
        })
        this.load.spritesheet("idle", "./assets/Char.png", {
            frameWidth: 24,
            frameHeight: 24,
        });
        this.load.image("base_tiles", "./assets/level1/tiles.png")
        this.load.tilemapTiledJSON("tilemap", "./assets/level1/Level1.json")
    }
    
    create() {
        //music
        backgroundMusic = this.sound.add('background')
        backgroundMusic.play(musicConfig)
        //tileset
        const map = this.make.tilemap({ key: "tilemap" })
        const tileset = map.addTilesetImage('base_tiles', 'base_tiles')
        const tilelayer = map.createLayer('Collide', tileset)
        const detailLayer= map.createLayer("Details", tileset)
        deathBlocks = map.createLayer('DeathBlocks', tileset)
        exit = map.createLayer('Exit', tileset)
        capybaraStopper = map.createLayer('CapybaraCharles', tileset)
        
        //check
        cursors = this.input.keyboard.createCursorKeys();
        shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        
        //sprite physics
        //blueDino = this.physics.add.sprite(1500, -50, "idle"); 
        blueDino = this.physics.add.sprite(90, 80, "idle");
        blueDino.setSize(14, 16)
        blueDino.setScale(1);

        capybara = this.physics.add.sprite(1139, 100, 'capybara')
        capybara.setVelocityX(capybaraflip)
        capybara.setSize(58, 45)
        capybara.setScale(0.3)

        coin1 = this.physics.add.sprite(150, 65, 'idlecoin').setImmovable(true)
        coin1.body.setAllowGravity(false);
        coin1.setScale(0.6)
    
        coin2 = this.physics.add.sprite(880, 35, 'idlecoin').setImmovable(true)
        coin2.body.setAllowGravity(false);
        coin2.setScale(0.6)
    
        coin3 = this.physics.add.sprite(1369, -10, 'idlecoin').setImmovable(true)
        coin3.body.setAllowGravity(false);
        coin3.setScale(0.6)

        //text
        score = this.add.text(0,0, `Coins: 0`, { fontSize: '8px', fill: '#FFFFFF' })
        staminatext = this.add.text(0,0, `Stamina: 100`, { fontSize: '8px', fill: '#FFFFFF' })
        levelText = this.add.text(0,0, `Level: 1`, { fontSize: '8px', fill: '#FFFFFF' })
        deathText = this.add.text(0,0, `Deaths: 0`, { fontSize: '8px', fill: '#FFFFFF' })
        
        
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
            key: "capybara",
            frameRate: 10,
            repeat: -1,
            frames: this.anims.generateFrameNumbers("capybara", { start: 72, end: 79 }),
        });
        
    
        this.physics.add.collider(blueDino, tilelayer , function () {
            canJump = true;
        });
    
        this.physics.add.collider(capybara, tilelayer)
        this.physics.add.collider(capybaraStopper, capybara, function()
        {
            if(capybaraflip === 80)
            {
                capybara.flipX = false
                capybara.setVelocityX(capybaraflip)
                capybaraflip = -80
            }
            else
            {
                capybara.setVelocityX(capybaraflip)
                capybara.flipX = true
                capybaraflip = 80
            }
        })
    

        chosenThis = this


        this.physics.add.collider(blueDino, deathBlocks, function() {
            numberOfDeaths ++
            deathText.setText(`Deaths: ${numberOfDeaths}`)
            blueDino.setX(90);
            blueDino.setY(80)
        })
    
        this.physics.add.overlap(blueDino, coin1, function() {
            numberOfCoins++
            score.setText(`Coins: ${numberOfCoins}`)
            coinNoise = chosenThis.sound.add('coinNoise')
            coinNoise.play(coinConfig)
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
            score.setText(`Coins: ${numberOfCoins}`)
            coinNoise = chosenThis.sound.add('coinNoise')
            coinNoise.play(coinConfig)
            coin3.disableBody(true, true)
        })
        const endFunc =  () => {
            localStorage.setItem('Deaths', numberOfDeaths)
            this.scene.start('secondLevel')
            
        }
        this.physics.add.collider(blueDino, exit, function() {
            
            if (numberOfCoins === 3) {
                
                endFunc()                  
            }
        })
    
        this.physics.add.overlap(blueDino, capybara, function() {
            
            if (blueDino.body.velocity.y > 100 || blueDino.body.velocity.y < -100)
            {
                capybara.disableBody(true, true)
                blueDino.setVelocityY(-90)
            }
            else
            {
                staminatimeout = false
                timeout = false
                staminabar = 600;
                numberOfDeaths++            
                deathText.setText(`Deaths: ${numberOfDeaths}`)
                blueDino.setX(90);
                blueDino.setY(80)
            }
        })
    
        capybaraStopper.setCollisionBetween(0,400)
        tilelayer.setCollisionBetween(0,400)
        deathBlocks.setCollisionBetween(0,400)
        exit.setCollisionBetween(0, 400)
    }
    
    update() {
        

        staminatext.setText(`Stamina: ${(staminabar/600 * 100).toFixed()}`)
        if(staminabar !== 600)
        {
            staminabar ++;
        }
        if(staminabar === 0){
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
        if (cursors.up.isDown && canJump && jumptimer > 30) {
            blueDino.anims.play("jump", true);
            blueDino.setVelocityY(-145);
            jumptimer = 0
        }
        if(blueDino.y > 180)
        {
            staminatimeout = false
            timeout = false
            blueDino.setX(90);
            blueDino.setY(70)
            staminabar = 600;
            numberOfDeaths++
            deathText.setText(`Deaths: ${numberOfDeaths}`)
        }


        coin1.anims.play("coinidle", true)
        coin2.anims.play("coinidle", true)
        coin3.anims.play("coinidle", true)
        capybara.anims.play("capybara", true)
    
        canJump = false;
    }
}


export default Level1;
