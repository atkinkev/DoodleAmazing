import {Scene} from 'phaser';
import ball from "./assets/imgs/ball.png";
import wall from "./assets/imgs/black_pixel.png"
import dpad from "./assets/imgs/pad.png";
import hole from "./assets/imgs/hole.png";

//global variables
var _coordinates;
var group;
var text;
var gx;
var gy;
var gz;
var zerox;
var zeroy;


export default class GameScene extends Phaser.Scene {


  constructor (config){
    super(config);

  }

  preload() {

    //preloading object images
      this.load.image('ball', ball);
      this.load.image('pad', ball);
      this.load.image('wall', wall);
      this.load.image('hole', hole);

    //set zerox and zeroy to dummy values
      zerox = 60000;
      zeroy = 60000;
  }

  create(coordinates) {
    var canvasHeight = window.innerHeight;
    const offset = window.innerWidth / 10;
    _coordinates = coordinates["walls"];
    const sizingRatio = canvasHeight / coordinates["max_height"]; //scaling for game canvas
    this.cursors = this.input.keyboard.createCursorKeys();

  //test printing
    text = this.add.text(10, 10, 'Game running...', {font: '32px Courier', fill: '#000000'});

    var even =true;
    var group = this.physics.add.staticGroup();
    this.physics.world.setFPS(120);
    console.log(this.physics.world.TILE_BIAS = 64);

  //ball placement
    for(var coordinate of _coordinates){
      even = !even;
      if(Math.abs(coordinate['X'] - coordinates["ball"][0]) < 20 && Math.abs(coordinate['Y'] - coordinates["ball"][1]) < 20){
        continue;
      }
      if(Math.abs(coordinate['X'] - coordinates["hole"][0]) < 20 && Math.abs(coordinate['Y'] - coordinates["hole"][1]) < 20){
        continue;
      }
      group.create(coordinate['X'] * sizingRatio + offset, coordinate['Y'] * sizingRatio, 'wall');
      /*
      group.setImmovable(true);
      group.setCircle(1);
      group.setBounce(0);
      group.checkCollision.up = true;
      group.moves = false;
      */
    }
    group.refresh();

  //ball settings
    this.marble = this.physics.add.image(coordinates["ball"][0] * sizingRatio + offset, coordinates["ball"][1] * sizingRatio, 'ball');
    this.goal = this.physics.add.image(coordinates["hole"][0] * sizingRatio + offset, coordinates["hole"][1] * sizingRatio, 'hole');
    this.marble.setCircle(15);
    this.marble.setCollideWorldBounds(true);
    this.marble.setBounce(1);

  //event listener for the accelerometer
    window.addEventListener('deviceorientation', this.handleOrientation, true);

    console.log(this.marble);
    this.physics.add.collider(this.marble, group, function(marble){
      if (marble.body.wasTouching.left || marble.body.touching.left){
        marble.setVelocityX(1);
      }
    });

  //ball/hole overlap triggers endgame
    this.physics.add.overlap(this.marble, this.goal, function() {
    text.setText('Game Over');
    return;
    });
  }

  update() {
  //test printing
    text.setText([
      'Game running...',
      'x: ' + gx,
      'y: ' + gy
      ]);


    this.marble.setVelocityX(gx);
    this.marble.setVelocityY(gy);

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

  handleOrientation (event) {

  //set the zero values to initial phone position
    if(zerox == 60000){
      zerox = event.beta;
      zeroy = event.gamma;
    }

  //calculate the angle relative to initial phone position
    gx = -(event.beta - zerox);
    gy = (event.gamma - zeroy);

  //ignore values where phone is upside-down
    if ( gx > 90 ) {gx = 90};
    if ( gx < -90 ) {gx = -90};
  }


}
