import {Scene} from 'phaser';
import ball from "./assets/imgs/ball.png";
import wall from "./assets/imgs/black_pixel.png"
import dpad from "./assets/imgs/pad.png";
import GyroNorm from 'gyronorm';
var _coordinates;
var group;

export default class GameScene extends Phaser.Scene {


  constructor (config){
    //Phaser.Scene.call(this, { key: 'GameScene'});
    super(config);

  }

  preload() {
      this.load.image('ball', ball);
      this.load.image('pad', ball);
      this.load.image('wall', wall);

      //adding in new gyronorm object
      var gn = new GyroNorm();
      this.gyro = gn;
  }

  create(coordinates) {
    var canvasHeight = window.innerHeight;
    _coordinates = coordinates["walls"];
    const sizingRatio = canvasHeight / coordinates["max_height"];
    this.cursors = this.input.keyboard.createCursorKeys();

    group = this.physics.add.staticGroup(
    /*{
      key: 'wall',
      frameQuantity: _coordinates.length
    }*/
    );



    for(var coordinate of _coordinates){
      group.create(coordinate['X'] * sizingRatio, coordinate['Y'] * sizingRatio, 'wall');
    }


//Phaser.Actions.PlaceOnRectangle(group.getChildren(), new Phaser.Geom.Rectangle(84, 84, 616, 416));
    group.refresh();

// This line of code drops the marble where the drawing indicates. We'll need this later.
    this.marble = this.physics.add.image(coordinates["ball"][0]  + 50,coordinates["ball"][1] + 25, 'ball');
    
    //marble physics
    this.marble.setCircle(46);
    this.marble.setFriction(0.005);
    this.marble.setCollideWorldBounds(true);
    this.marble.setBounce(1);
    //marble.setVelocity(150);

    this.physics.add.collider(this.marble, group);
  }

  //initLevels() {}
  //showLevel(level) {}
  //updateCounter() {}
  //managePause() {}
  //manageAudio() {}

  update() {

  //initialize marble movement (makes sure it stops)
    this.marble.setVelocity(0);
    this.marble.setAngularVelocity(0);
/*
  //gyro object loop   
    this.gyro.init().then(function(){
      this.gyro.start(function(data){
            //test printing
            console.log("Alpha = " + data.do.alpha);
            console.log("Beta = " + data.do.beta);
            console.log("Gamma = " + data.do.gamma);
            console.log("Absolute = " + data.do.absolute);
      this.marble.setAccelerationX(data.dm.x);
      this.marble.setAccelerationY(data.dm.y);

      });
    }).catch(function(e){
      console.log("DeviceOrientation not supported by device.");
    });

*/
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
