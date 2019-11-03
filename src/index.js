import Phaser from "phaser";
import Preloader from './Preloader';
import MainMenu from './MainMenu';
import GameScene from './GameScene';

import logoImg from "./assets/logo.png";

import doodleReader from './doodleReader';
import {addImageProcess} from './doodleReader';
import cannyEdgeDetector from 'canny-edge-detector';
require("babel-polyfill");

// User image input
doodleReader.waitForInput(cannyEdgeDetector).then(coordinates => {
  console.log(coordinates);
  setup(coordinates);
});

function setup(){

  console.log('in setup');
  const config = {
    type: Phaser.AUTO,
    parent: "doodle-amazing",
    width: 800,
    height: 600,
    backgroundColor: '#006060',
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity:0
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
      //global variables
      extend: {
        cursors: null,
        marble: null
      }
    }
  };

  //const game = new Phaser.Game(config);

  var game = new Phaser.Game(config);

  //method of adding scenes from Unbaffling
  
  //game.scene.add('Preloader', Preloader);
  //game.scene.add('MainMenu', MainMenu);
  game.scene.add('GameScene', GameScene);

  function preload() {

  }

  function create() {

    this.scene.start('GameScene');
    
  }

  function update() {
    
  }

  
}

