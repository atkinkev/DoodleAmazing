var MainMenu = new Phaser.Class({

  Extends: Phaser.Scene,
  initialize:
  function MainMenu () {
    Phaser.Scene.call(this, {key: 'mainmenu'});
  },

  preload: function () {},

  create: function (){
    //Add title image
    //Add buttons and use sprite sheet
      //temporary text-based start button
      const startButton = this.add.text(100, 100, 'Start!', {fill: '#0f0'})
      .setInteractive()
      .on('pointerdown', () => this.doStart());

      console.log('create is ready');
  },

  // Tutorial function here
  /*
  doTutor: function(){
    console.log('tutorial was called');
      this.scene.start('tutorial');
  },
  */

  doStart: function () {
    console.log('menuscene was called!');
      this.scene.start('game');
      console.log('mainmenu: should not get here');
  }

});
