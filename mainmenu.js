import Phaser from "phaser";
let button;
class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    preload() {}

    create() {
        let gameTitle = this.add.text(40, 70, `Dino World`, {
            fontSize: "32px",
            fill: "#FFFFFF",
        });
        const helloButton = this.add.text(120, 100, "Play Game", {
            fill: "#0f0",
        });
        helloButton.setInteractive();

        helloButton.on("pointerdown", () => {
            this.scene.start("firstLevel");
        });
    }

    update() {}
}

export default MainMenu;
