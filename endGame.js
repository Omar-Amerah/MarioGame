import Phaser from 'phaser'


let numberOfDeaths

class EndGame extends Phaser.Scene {
    constructor() {
        super("endGame");
    }

    preload() {
        numberOfDeaths = localStorage.getItem("Deaths");
    }

    create() {
        let endGameText = this.add.text(100, 100, `End of Game`, {
            fontSize: "32px",
            fill: "#FFFFFF",
        });
        let youWinText =this.add.text(160, 150, `You Win!`, {
            fontSize: "18px",
            fill: "#FFFFFF",
        });

        let deaths = this.add.text(140, 185, `You died ${numberOfDeaths} times`, {
            fontSize: "14px",
            fill: "#FFFFFF",
        });
    }

    update() {

    }
}


export default EndGame