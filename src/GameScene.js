import {Scene} from 'phaser';
import ball from "./assets/imgs/ball.png";
import wall from "./assets/imgs/black_pixel.png"
import dpad from "./assets/imgs/pad.png";
var _coordinates;

export default class GameScene extends Phaser.Scene {


  constructor (config){
    //Phaser.Scene.call(this, { key: 'GameScene'});
    super(config);

  }

  preload() {
      this.load.image('ball', ball);
      this.load.image('pad', ball);
      this.load.image('wall', wall);
  }

  create(coordinates) {
    _coordinates = coordinates["walls"];

    this.cursors = this.input.keyboard.createCursorKeys();
    for(var coordinate of _coordinates){
      this.wall = this.physics.add.image(coordinate['X'] + 50, coordinate['Y'] + 25, 'wall');
    }

    this.marble = this.physics.add.image(coordinates["ball"][0]  + 50,coordinates["ball"][1] + 25, 'ball');
    this.marble.setCircle(46);
    this.marble.setFriction(0.005);
    this.marble.setCollideWorldBounds(true);
    this.marble.setBounce(1);
    //marble.setVelocity(150);

  }

  //initLevels() {}
  //showLevel(level) {}
  //updateCounter() {}
  //managePause() {}
  //manageAudio() {}

  update() {

  //marble motion with keyboard input
  //will update with accelerometer api
    this.marble.setVelocity(0);
    this.marble.setAngularVelocity(0);

    if(this.cursors.left.isDown){
      this.marble.setVelocityX(-300);
      this.marble.setAngularVelocity(-300);
    }

    else if(this.cursors.right.isDown){
      this.marble.setVelocityX(300);
      this.marble.setAngularVelocity(300);
    }

    if(this.cursors.up.isDown){
      this.marble.setVelocityY(-300);
      this.marble.setAngularVelocity(-300);
    }

    else if(this.cursors.down.isDown){
      this.marble.setVelocityY(300);
      this.marble.setAngularVelocity(300);
    }
  }

  //wallCollision() {}

  handleOrientation(e) {

  }

  //finishLevel() {}
}
