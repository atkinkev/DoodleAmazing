import {Scene} from 'phaser';
import ball from "./assets/imgs/ball.png";
import wall from "./assets/imgs/black_pixel.png"
import dpad from "./assets/imgs/pad.png";
<<<<<<< HEAD
import GyroNorm from 'gyronorm';
=======
var _coordinates;
>>>>>>> 3b7794a28c9100cb3e10c4125b08810d221d7371

export default class GameScene extends Phaser.Scene {


  constructor (config){
    //Phaser.Scene.call(this, { key: 'GameScene'});
    super(config);

  }

  preload() {
      this.load.image('ball', ball);
      this.load.image('pad', ball);
<<<<<<< HEAD
      var gn = new GyroNorm();
      this.gyro = gn;
=======
      this.load.image('wall', wall);
>>>>>>> 3b7794a28c9100cb3e10c4125b08810d221d7371
  }

  create(coordinates) {
    _coordinates = coordinates["walls"];

    this.cursors = this.input.keyboard.createCursorKeys();
<<<<<<< HEAD
    
    this.marble = this.physics.add.image(100,240, 'ball');
=======
    for(var coordinate of _coordinates){
      this.wall = this.physics.add.image(coordinate['X'] + 50, coordinate['Y'] + 25, 'wall');
    }

    this.marble = this.physics.add.image(coordinates["ball"][0]  + 50,coordinates["ball"][1] + 25, 'ball');
>>>>>>> 3b7794a28c9100cb3e10c4125b08810d221d7371
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
