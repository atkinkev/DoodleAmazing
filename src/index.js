import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import {getEdgeCoordinates} from './doodleReader';
import {findEdges} from './doodleReader';
const canny = require('canny-edge-detector');
require("babel-polyfill");

getEdgeCoordinates();
findEdges();

const config = {
  type: Phaser.AUTO,
  parent: "doodle-amazing",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("logo", logoImg);
}

function create() {
  const logo = this.add.image(400, 150, "logo");

  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });
}




// Beginning of image upload
var inputElement = document.getElementById("pic");

inputElement.onchange = function(event) {
   var image = inputElement.files[0];

   var reader = new FileReader();
   reader.onload = function(e){
    var img = new Image();
   }
}

