import {Scene} from 'phaser';
import ball from "./assets/imgs/ball.png";
import wall from "./assets/imgs/black_pixel.png"
import dpad from "./assets/imgs/pad.png";
import GyroNorm from 'gyronorm';
var _coordinates;
var text;
var gx;
var gy;
var gz;

var zerox;
var zeroy;

export default class GameScene extends Phaser.Scene {


  constructor (config){
    //Phaser.Scene.call(this, { key: 'GameScene'});
    super(config);

  }

  preload() {
      this.load.image('ball', ball);
      this.load.image('pad', ball);
      this.load.image('wall', wall);
      /*
      //adding in new gyronorm object
      var gn = new GyroNorm();
      this.gyro = gn;
      */

      zerox = 60000;
      zeroy = 60000;
  }

  create(coordinates) {
    var canvasHeight = window.innerHeight;
    _coordinates = coordinates["walls"];
    const sizingRatio = canvasHeight / coordinates["max_height"];
    this.cursors = this.input.keyboard.createCursorKeys();

    for(var coordinate of _coordinates){
      this.wall = this.physics.add.image(coordinate['X'] * sizingRatio, coordinate['Y'] * sizingRatio, 'wall');
    }


    text = this.add.text(10, 10, '', {font: '12px Courier', fill: '#00ff00'});

    window.addEventListener('deviceorientation', this.handleOrientation, true);

    gx = coordinates["ball"][0] + 50;
    gy = coordinates["ball"][1] + 25;

    // This line of code drops the marble where the drawing indicates. We'll need this later.
    this.marble = this.physics.add.image(gx, gy, 'ball');
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

  //initialize marble movement (makes sure it stops)

    text.setText([
      'x: ' + gx,
      'y: ' + gy
      ]);

    console.log([
      'x: ' + gx,
      'y: ' + gy
      ]);

    //this.marble.setVelocity(gx, gy);
    this.marble.setVelocityY(gy);

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

  handleOrientation (event) {

    if(zerox == 60000){
      zerox = event.beta;
      zeroy = event.gamma;
    }

//mozilla developer code
    gx = (event.beta - zerox);
    gy = (event.gamma - zeroy);

    if ( gx > 90 ) {gx = 90};
    if ( gx < -90 ) {gx = -90};

    //gx += 90;
    //gy += 90;
  }

  //finishLevel() {}
}
