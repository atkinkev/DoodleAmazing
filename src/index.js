import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import {toGreyScale} from './doodleReader';
require("babel-polyfill");

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

var image = new Image();
image.crossOrigin = "anonymous";
image.onload = function () {

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;

// draw the image
// (this time to grab the image's pixel data
ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);

// canvas related variables
}
image.src = "logo.png"


// Testing calls from another js file
//console.log(doodleReader.invertImage());
