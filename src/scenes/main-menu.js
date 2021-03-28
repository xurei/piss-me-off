//setting game configuration and loading the assets for the loading screen

import Phaser from "phaser";
import tilesMap from  '../assets/images/tiles.png';

export class MainMenuScene extends Phaser.Scene {
    constructor () {
        super('MainMenu');
    }
    
    preload() {
        //assets we'll use in the loading screen
        //this.load.image('preloadbar', preloaderBar);
        this.load.spritesheet('tiles', tilesMap, { frameWidth: 16, frameHeight: 16 });
    }
    
    create() {
        //loading screen will have a white background
        //this.game.stage.backgroundColor = '#f00';
        
        //scaling options
        //this.scale.scaleMode = Phaser.Scale.ScaleModes.FIT;
        
        //have the game centered horizontally
        //this.scale.pageAlignHorizontally = true;
        //this.scale.pageAlignVertically = true;
        
        //physics system
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //this.
        this.add.image(50, 50, 'tiles', 0);
        this.add.image(70, 70, 'tiles', 10*44 + 0);
        console.log('create2');
        
    }
    
    update(time, delta) {
    }
}
