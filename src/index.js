import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import {toGreyScale} from './doodleReader';
require("babel-polyfill")
const { Image } = require('image-js');

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

execute().catch(console.error);

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

async function execute() {
  let image = await Image.load(logoImg);
  let grey = image
    .grey() // convert the image to greyscale.
    .resize({ width: 200 }) // resize the image, forcing a width of 200 pixels. The height is computed automatically to preserve the aspect ratio.
    .rotate(30); // rotate the image clockwise by 30 degrees.
  //return grey.save('cat.png');
  console.log(grey.width);
}
