import Phaser from "phaser";

class MainMenu extends Phaser.Scene {
    constructor() {
        super("mainMenu");
    }

    create() {
        const { width, height } = this.scale;

        let gameTitle = this.add.text(width / 2, height / 3, "Dino World", {
            fontSize: "40px",
            fill: "#FFFFFF",
        }).setOrigin(0.5);

        const playButton = this.add.text(width / 2, height / 2, "Play Game", {
            fontSize: "28px",
            backgroundColor: "#222",
            color: "#0f0",
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
        })
        .setOrigin(0.5)
        .setInteractive();

        // Hover effects
        playButton.on("pointerover", () => {
            playButton.setStyle({ fill: "#ff0" });
        });
        playButton.on("pointerout", () => {
            playButton.setStyle({ fill: "#0f0" });
        });

        playButton.on("pointerdown", () => {
            this.scene.start("firstLevel");
        });
    }
}

export default MainMenu;
