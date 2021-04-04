//setting game configuration and loading the assets for the loading screen

import Phaser from "phaser";
import tilesMap from  '../assets/images/tiles.png';
import playerImage from  '../assets/images/player.png';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';
import constants from '../constants';
import { DungeonRoom } from '../dungeon-room';

export class DungeonMapScene extends Phaser.Scene {
    constructor () {
        super('DungeonMap');
    }
    
    preload() {
        //assets we'll use in the loading screen
        this.load.image('player', playerImage);
    
        this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    
        /*this.load.scenePlugin({
            key: 'AnimatedTilesPlugin',
            url: animatedTiles.register,
            //systemKey : 'animatedTiles',
            //sceneKey: 'banner'
        });*/
    }
    
    create() {
        
        //this.add.image(50, 50, 'tiles', 0);
        //this.add.image(70, 70, 'tiles', 10*44 + 1);
    
        const currentRoom = new DungeonRoom(this, 0, 0);
        const leftRoom    = new DungeonRoom(this, -1, 0);
        const rightRoom   = new DungeonRoom(this, +1, 0);
        const topRoom     = new DungeonRoom(this, 0, -1);
        const downRoom    = new DungeonRoom(this, 0, +1);
    
        this.player = this.physics.add.sprite(200, 200, 'player');
        this.player.setDepth(constants.Z_PLAYER);
        
        currentRoom.load();
        rightRoom.load();
        leftRoom.load();
        topRoom.load();
        downRoom.load();
    
        /*const debugGraphics = this.add.graphics().setAlpha(0.75);
        borderTiles.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });*/
        
        console.log('create2');
    
        //move player with cursor keys
        //this.cursors = this.input.keyboard.createCursorKeys();
        
        console.log(this.input);
        
        //move player with gamepad
        // TODO check presence of gamepad (see https://github.com/photonstorm/phaser3-examples/blob/master/public/src/input/gamepad/gamepad%20across%20scenes.js)
        //this.pad = this.input.gamepad.pad1;
        this.input.gamepad.once('connected', pad => {
            this.pad = pad;
            console.log('Pad detected !');
        });
    }
    
    update(time, delta) {
        if (!this.pad) {
            return;
        }
        const playerVelocity = 150;
        let nbDown = 0;
    
    
        const padUp    = this.pad.axes[1].getValue() < -0.5;
        const padDown  = this.pad.axes[1].getValue() > 0.5;
        const padLeft  = this.pad.axes[0].getValue() < -0.5;
        const padRight = this.pad.axes[0].getValue() > 0.5;
        
        if (padUp) {
            ++nbDown;
        }
        if (padDown) {
            ++nbDown;
        }
        if (padLeft) {
            ++nbDown;
        }
        if (padRight) {
            ++nbDown;
        }
        nbDown = Math.min(2, nbDown);
        const norm = Math.sqrt(nbDown); // TODO remove the sqrt()
        
        if (padUp) {
            this.player.body.setVelocityY(-playerVelocity / norm);
        }
        else if (padDown) {
            this.player.body.setVelocityY(+playerVelocity / norm);
        }
        else {
            this.player.body.setVelocityY(0);
        }
        
        if (padLeft) {
            this.player.body.setVelocityX(-playerVelocity / norm);
        }
        else if (padRight) {
            this.player.body.setVelocityX(+playerVelocity / norm);
        }
        else {
            this.player.body.setVelocityX(0);
        }
    }
}
