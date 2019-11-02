
var Game = new Phaser.Class ({
  Extends: Phaser.Scene,

  initalize:
  function Game(){
    Phaser.Scene.call(this, { key: 'game'});
  },

  preload: function () {},

  create: function() {
    console.log('in game create');

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

  },
  initLevels: function() {},
  showLevel: function(level) {},
  updateCounter: function() {},
  managePause: function() {},
  manageAudio: function() {},
  update: function() {
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
  },
  wallCollision: function() {},
  handleOrientation: function(e) {
    var x = e.gamma;
    var y = e.beta;
    //Ball._player.body.velocity.x += x;
    //Ball._player.body.velocity.y += y;
  },
  finishLevel: function() {}
});
