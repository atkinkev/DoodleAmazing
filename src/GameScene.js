import {Scene} from 'phaser';
import ball from "./assets/imgs/ball.png";
import dpad from "./assets/imgs/pad.png";
import GyroNorm from 'gyronorm';

export default class GameScene extends Phaser.Scene {
  


  constructor (config){
    //Phaser.Scene.call(this, { key: 'GameScene'});
    super(config);
  }

  preload() {
      this.load.image('ball', ball);
      this.load.image('pad', ball);
      var gn = new GyroNorm();
      this.gyro = gn;
  }

  create() {
    console.log('in game create');

    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.marble = this.physics.add.image(100,240, 'ball');
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


    this.marble.setVelocity(0);
    this.marble.setAngularVelocity(0);

    this.gyro.init().then(function(){
      this.gyro.start(function(data){
            console.log("Alpha = " + data.do.alpha);
            console.log("Beta = " + data.do.beta);
            console.log("Gamma = " + data.do.gamma);
            console.log("Absolute = " + data.do.absolute);
      });
    }).catch(function(e){
      console.log("DeviceOrientation not supported by device.");
    });
    

  //marble motion with keyboard input
  //will update with accelerometer api
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
