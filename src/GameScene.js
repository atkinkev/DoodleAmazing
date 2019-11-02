import {Scene} from 'phaser';
import ball from "./assets/imgs/ball.png";

export default class GameScene extends Phaser.Scene {

  constructor (config){
    //Phaser.Scene.call(this, { key: 'GameScene'});
    super(config);
  }

  preload() {
      this.load.image('ball', ball);
  }

  create() {
    console.log('in game create');

    var marble = this.physics.add.image(100,240, 'ball');

    marble.setCircle(46);

    marble.setCollideWorldBounds(true);

    marble.setBounce(1);

    marble.setVelocity(150);

  }

  //initLevels() {}
  //showLevel(level) {}
  //updateCounter() {}
  //managePause() {}
  //manageAudio() {}

  update () {

  }

  //wallCollision() {}

  handleOrientation(e) {

  }

  //finishLevel() {}
}
