import Phaser from "phaser";
import GameScene from './GameScene';
import EndGame from "./EndGame";
import Menus from './Menus.js'
import doodleReader from './doodleReader';
import cannyEdgeDetector from 'canny-edge-detector';
require("babel-polyfill");

// User image input
Menus.initMainMenu(); 
doodleReader.waitForInput(cannyEdgeDetector).then(coordinates => {
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

  game.scene.add('GameScene', GameScene);
  game.scene.add('EndGame', EndGame);

  function preload() {

  }

  function create() {

    this.scene.start('GameScene', coordinates);
    
  }

  function update() {
    
  }

  
}

