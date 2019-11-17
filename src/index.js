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
  console.log(coordinates["ball"]);
  console.log(coordinates["hole"]);
  setup(coordinates);
});

function setup(coordinates){
  const config = {
    type: Phaser.CANVAS,
    parent: "doodle-amazing",
    width: window.innerWidth, //* window.devicePixelRatio / 2,
    height: window.innerHeight, //* window.devicePixelRatio / 2,
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
        marble: null,
        wall: null
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

    this.scene.start('GameScene', coordinates);
    
  }

  function update() {
    
  }

  
}

