import {Scene} from 'phaser';
import wall from "./assets/imgs/black_pixel.png"
import ball from "./assets/imgs/ball.png";

export default class Preloader extends Phaser.Scene{

    constructor (config) {
      super(config);
      //pack:{files[]} eliminates the need for boot scene to preload loadingbar images
      /*
      Phaser.Scene.call(this, {
        key: 'Preloader',
        pack: {
          files: [
            {type: 'image', key: 'loadingBar', url: 'assets/loadingbar.png'}
          ]
        }
      });
      */
    }

    setPreloadSprite (sprite) {
      this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };

      sprite.visible = true;

      //set callback for loading progress updates
      this.load.on('progress', this.onProgress, this);
      this.load.on('fileprogress', this.onFileProgress, this);
    }

    onProgress (value) {

      if (this.preloadSprite){
        //calculate width based on value
        var w = Math.floor(this.preloadSprite.width * value);
        console.log('onProgress: value=' + value + " w=" + w);

        //set width of sprite
        this.preloadSprite.sprite.frame.width = (w <= 0 ? 1: w);
        this.preloadSprite.sprite.frame.cutWidth = w;

        // update screen
        this.preloadSprite.sprite.frame.updateUVs();
      }

    }

    onFileProgress (file){
      console.log('onFileProgress: file.key=' + file.key);
    }

    preload() {


      //setup loading bar (preloaded in pack: call in constructor)
      this.preloadBar = this.add.sprite(160, 240, 'preloaderBar');
      this.setPreloadSprite(this.preloadBar);

      //load image assets
      this.load.image('ball', ball);
      this.load.image('wall', black_pixel);
      this.load.image('hole', 'assets/imgs/hole.png');
      this.load.image('element-v', 'assets/imgs/element-v.png');
      this.load.image('element-h', 'assets/imgs/element-h.png');
      this.load.image('button-pause', 'assets/imgs/button-pause.png');
      this.load.image('button-start', 'assets/imgs/button-start.png');
      this.load.image('screen-bg', 'assets/imgs/screen-bg.png');
      this.load.image('border-horizontal', 'assets/imgs/border-horizontal.png');
      this.load.image('border-vertical', 'assets/imgs/border-vertical.png');
      
      //Added from index.js file
      this.load.image("logo", 'assets/logo.png');
      
      //load audio assets
      this.load.audio('audio-bounce', 'assets/Jump2.wav');

      /*TESTING: load the same image 500 times to test the loading bar
      for (var i = 0; i < 500; i ++) {
        this.load.image('testloading'+ i, 'img/red_button09.png');
      };
      */

    }

    create() {
      console.log('Preloader scene is ready, now start the actual game and never return to this scene');

      //dispose loader bar images
      //this.loadingBar.destroy();
      this.preloadSprite = null;

      //start menu
      this.scene.start('MainMenu');
      //console.log('preloader: should not get here');
    }


}
