import {Scene} from 'phaser';

export default class MainMenu extends Phaser.Scene {


  constructor (config) {
    //Phaser.Scene.call(this, {key: 'MainMenu'});
    super(config);
  }

  preload () {}

  create (){
    //Add title image
    //Add buttons and use sprite sheet
      //temporary text-based start button
      this.add.text(100, 100, 'Start!', {fill: '#0f0'});
      this.input.once('pointerdown', function (event){

        console.log('main menu to game phase');
        this.scene.start('GameScene');

      }, this);

      console.log('create is ready');
  }

  // Tutorial function here
  /*
  doTutor: function(){
    console.log('tutorial was called');
      this.scene.start('tutorial');
  },
  */

  //this function isn't working
  /* 
  doStart: function () {
    console.log('menuscene was called!');
      this.scene.start('game');
      console.log('mainmenu: should not get here');
  }*/

}
