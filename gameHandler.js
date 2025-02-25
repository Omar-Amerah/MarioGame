import Phaser from "phaser";

class CreateLevels extends Phaser.Scene {
    constructor() {
      super("bootGame");
      
    }
    create() {

      this.scene.start("firstLevel")

    }

  }
  export default CreateLevels
  