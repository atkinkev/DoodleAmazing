import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import {prepImage} from './doodleReader';
import {getEdgeCoordinates} from './doodleReader';
import {addImageProcess} from './doodleReader';
import cannyEdgeDetector from 'canny-edge-detector';
require("babel-polyfill");

/* User Entry Point
** Behavior: Waits for user to input image using input element on landing page
** Returns: Black and White canny edge detected image
*/
var inputElement = document.getElementById("pic");
inputElement.onchange = function(event) {
  var image = inputElement.files[0];
  var reader = new FileReader();
    reader.onload = function(e){
    // remove upload button
      inputElement.style.display = "none";
      // run image through canny edge detector
      prepImage(e.target.result, cannyEdgeDetector).then(resultImage =>{
        getEdgeCoordinates(resultImage.toDataURL()).then(height =>{
          console.log(height);
          setup();
        })
      })
    }
    reader.readAsDataURL(image);
}

/*
function setup(){
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
  
}
*/
