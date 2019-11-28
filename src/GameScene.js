import {Scene} from 'phaser';
import ball from "./assets/imgs/ball.png";
import wall from "./assets/imgs/black_pixel.png"
import dpad from "./assets/imgs/pad.png";
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
  }

  create(coordinates) {
    var canvasHeight = window.innerHeight;
    const offset = window.innerWidth / 10;
    _coordinates = coordinates["walls"];
    const sizingRatio = canvasHeight / coordinates["max_height"];
    this.cursors = this.input.keyboard.createCursorKeys();
    var even =true;
    var group = this.physics.add.staticGroup();
    this.physics.world.setFPS(120);
    console.log(this.physics.world.TILE_BIAS = 64);
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

    this.marble = this.physics.add.image(coordinates["ball"][0] * sizingRatio + offset, coordinates["ball"][1] * sizingRatio, 'ball');
    this.goal = this.physics.add.image(coordinates["hole"][0] * sizingRatio + offset, coordinates["hole"][1] * sizingRatio, 'hole');
    this.marble.setCircle(15);
    this.marble.setCollideWorldBounds(true);

    console.log(this.marble);
    this.physics.add.collider(this.marble, group, function(marble){
      if (marble.body.wasTouching.left || marble.body.touching.left){
        marble.setVelocityX(1);
      }
    });

    window.addEventListener("deviceorientation", this.handleOrientation.bind(this), true);
    //this.marble.setBounce(1);
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
    //if (e.gamma)
    this.marble.setVelocityX(e.beta * 12)
    this.marble.setVelocityY(e.gamma * -12)
  }

  //finishLevel() {}
}
