import {Scene} from 'phaser';

export default class GameScene extends Phaser.Scene {

  constructor (config){
    //Phaser.Scene.call(this, { key: 'GameScene'});
    super(config);
  }

  //preload() {}

  create() {
    console.log('in game create');

    this.add.text(400, 300, 'Started!', {fill: '#0f0'});

    this.ball = this.physics.add.image(160, 240, 'sprites', 'ball');
    this.ball.anchor.set(0.5);
    this.physics.enable(this.ball, Phaser.Physics.ARCADE);
    this.ball.body.setSize(18, 18);
    this.ball.body.bounce.set(0.3, 0.3);

    this.keys = this.game.input.keyboard.createCursorKeys();

    window.addEventListener("deviceorientation", this.handleOrientation, true);

    this.hole = this.physics.add.image(160, 90, 'sprites', 'hole');
    this.physics.enable(this.hole, Phaser.Physics.ARCADE);
    this.hole.anchor.set(0.5);
    this.hole.body.setSize(2, 2);

  }

  //initLevels() {}
  //showLevel(level) {}
  //updateCounter() {}
  //managePause() {}
  //manageAudio() {}

  update () {
    if(this.keys.left.isDown) {
      this.ball.body.velocity.x -= this.movementForce;
    }
    else if(this.keys.right.isDown) {
      this.ball.body.velocity.x += this.movementForce;
    }
    if(this.keys.up.isDown) {
      this.ball.body.velocity.y -= this.movementForce;
    }
    else if(this.keys.down.isDown) {
      this.ball.body.velocity.y += this.movementForce;
    }
  }

  //wallCollision() {}

  handleOrientation(e) {
    var x = e.gamma;
    var y = e.beta;
    //Ball._player.body.velocity.x += x;
    //Ball._player.body.velocity.y += y;
  }

  //finishLevel() {}
}
