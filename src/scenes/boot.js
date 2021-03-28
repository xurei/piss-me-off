//const animatedTiles = require('phaser-animated-tiles');
import Phaser from "phaser";
import preloaderBar from '../assets/images/preloader-bar.png';
import brownDoor from '../assets/images/browndoor.png';
import tilesMap from  '../assets/images/tiles.png';
import dungeonTilesMap from  '../assets/images/dungeon_tiles_0_retouche.png';
import level1 from  '../assets/levels/level1.json';

export class BootScene extends Phaser.Scene {
    constructor () {
        super('Boot');
    }
    
    preload() {
        this.load.on('progress', (value) => {
            console.log(value);
            if (value === 1) {
                this.scene.start('DungeonMap');
            }
        });
    
        let guides = this.add.graphics();
        guides.fillStyle(0x00ff00, 1);
        guides.fillRect(0, 360, 1280, 1);
        guides.fillRect(640, 0, 1, 1280);
    
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(100, 340, 1080, 40);
        
        //assets we'll use in the loading screen
        this.load.image('preloadbar', preloaderBar);
        this.load.image('brownDoor', brownDoor);
        this.load.spritesheet('tiles', tilesMap, { frameWidth: 16, frameHeight: 16 });
        
        this.load.image('dungeonTiles', dungeonTilesMap);
        this.load.tilemapTiledJSON('level1', level1);
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
    /*
        let guides = this.add.graphics();
        guides.fillStyle(0x00ff00, 1);
        guides.fillRect(0, 360, 1280, 1);
        guides.fillRect(640, 0, 1, 1280);
        
        //this.
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(100, 340, 1080, 40);*/
    }
}
