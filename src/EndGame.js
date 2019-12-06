import {Scene} from 'phaser';
import GameScene from './GameScene';
import menuBack from "./assets/imgs/grey_panel.png";
import menuColor from './assets/imgs/red_panel.png';
import menuButton from './assets/imgs/red_button07.png';
import retButton from './assets/imgs/return.png';
import exitButton from './assets/imgs/exitRight.png';
import menuController from './Menus.js';

var failure = false;

export default class EndGame extends Phaser.Scene {

	constructor (config) {
  	  super(config);

  	}

  	preload () {
  		this.load.image('menuBack', menuBack);
  		this.load.image('menuColor', menuColor);
  		this.load.image('menuButton', menuButton);
  		this.load.image('retButton', retButton);
  		this.load.image('exitButton', exitButton);
  	}

  	create (coordinates) {

  		this.input.addPointer(1);

  		var heightCenter = window.innerHeight / 2;
  		var widthCenter = window.innerWidth / 2;

  		this.menuColor = this.add.image(widthCenter, heightCenter - 20, 'menuColor');
  		this.menuBackground = this.add.image(widthCenter, heightCenter, "menuBack");
  		//this.menuBackground.setOrigin(0, 0);
  		this.menuColor.setDisplaySize(275, 170);
  		this.menuBackground.setDisplaySize(275, 150); 

  		var text = this.add.text(widthCenter - 110, heightCenter - 55, 'Replay or Exit', {font: 'Bold 32px Arial', fill: '#00000', boundsAlignH: 'center', boundsAlignV: 'middle'});
  		this.button1 = this.add.image(widthCenter - 55, heightCenter + 10, 'menuButton');
  		this.retButton = this.add.image(widthCenter - 55, heightCenter + 10, 'retButton');

  		this.button2 = this.add.image(widthCenter + 55, heightCenter + 10, 'menuButton');
  		this.exitRight = this.add.image(widthCenter + 55, heightCenter + 10, 'exitButton');

  		this.button1.setInteractive()
  			.on('pointerdown', () => {
  				var game = this.scene.get('GameScene');
  				game.scene.restart();

  				this.scene.stop();
  			});

  		this.button2.setInteractive()
  			.on('pointerdown', () => {
          //this.scene.stop();
          this.scene.stop();
  				menuController.removeGameCanvas();
          menuController.initMainMenu();
  			});  		
  		//test printing
  		//var congrats = this.add.text(50, 50, 'You Win!', {font: '32px Courier', fill: '#000000'});
  	}
}