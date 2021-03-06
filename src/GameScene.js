import {Scene} from 'phaser';
import EndGame from './EndGame';
import ball from "./assets/imgs/ball.png";
import wall from "./assets/imgs/black_pixel.png"
import dpad from "./assets/imgs/pad.png";
import hole from "./assets/imgs/target.png";
import background from "./assets/imgs/blue_panel.png"

//global variables
var _coordinates;
var group;
var text;
var gx;
var gy;
var gz;
var zerox;
var zeroy;
var timerEvent;
var testTime;
var sumDelta;
var iterator;

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
      //this.load.image('background', background);
      
    //set zerox and zeroy to dummy values
      zerox = 60000;
      zeroy = 60000;
    //set scale ratio
      //scaleRatio = window.devicePixelRatio / 3;
      iterator = 0;
  }

  create(coordinates) {
    var canvasHeight = window.innerHeight;
    const offset = window.innerWidth / 10;
    _coordinates = coordinates["walls"];
    const sizingRatio = canvasHeight / coordinates["max_height"]; //scaling for game canvas
    
    timerEvent = this.time.addEvent();
    /*
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);
    this.background.setDisplaySize(window.innerWidth, window.innerHeight);
    */

    this.cursors = this.input.keyboard.createCursorKeys();

  //test printing
    text = this.add.text(10, 10, '', {font: '12px Courier', fill: '#000000'});

    var even =true;
    var group = this.physics.add.staticGroup();
    this.physics.world.setFPS(120);
    this.physics.world.TILE_BIAS = 64;

  //ball placement
    if (_coordinates[0].failure){
      text.setText(['Image was unable to be converted to game coordinates. Please try another doodle.']);
      this.gameOver();
    }
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
    this.marble.setCircle(12, true);
    this.goal.setSize(10, 10, true);
    
    this.marble.setCollideWorldBounds(true);
    this.marble.setBounce(0);


  //event listener for the accelerometer
    window.addEventListener('deviceorientation', this.handleOrientation.bind(this), true);

    this.physics.add.collider(this.marble, group, function(marble){
      if (marble.body.wasTouching.left || marble.body.touching.left){
        marble.setVelocityX(1);
      }
    });
    
    this.physics.add.overlap(this.marble, this.goal, this.gameOver.bind(this));
  }

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

/* defunct timer function
  handleTimer (time) {
    if( testTime < 0 ){
      testTime = parseFloat(time);
    }

  }
*/


//handles device orientation calculations
  handleOrientation (e) {
/* merge conflict
  //set the zero values to initial phone position
    if(zerox == 60000){
      zerox = event.beta;
      zeroy = event.gamma;
    }

  //calculate the angle relative to initial phone position
    gx = -(event.beta - zerox);
    gy = -(event.gamma - zeroy);

  //ignore values where phone is upside-down
    if ( gx > 90 ) {gx = 90};
    if ( gx < -90 ) {gx = -90};
  
    this.marble.setVelocityX(gx * 12);
    this.marble.setVelocityY(gy * 12);  
*/

    this.marble.setVelocityX(e.beta * 12)
    this.marble.setVelocityY(e.gamma * -12)

  }

// game over function: passes control to the EndGame menu scene
  gameOver() {
    //var finalTime = time;
      this.scene.pause();
      this.scene.launch('EndGame');
  }


}
