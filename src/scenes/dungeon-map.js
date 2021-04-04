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
        this.rooms = [];
        this.currentRoomX = 0;
        this.currentRoomY = 0;
    }
    
    preload() {
        //assets we'll use in the loading screen
        this.load.image('player', playerImage);
    
        this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
    
        this.cameras.main.setViewport(0, 0, constants.ROOM_W, constants.ROOM_H);
    }
    
    create() {
        this.player = this.physics.add.sprite(200, 200, 'player');
        this.player.setDepth(constants.Z_PLAYER);
        
        this.addRoom(0, 0, 'level1');
        this.addRoom(1, 0, 'level1');
        this.addRoom(2, 0, 'level1');
        this.addRoom(0, 1, 'level1');
        this.addRoom(0, 2, 'level1');
        this.addRoom(1, 1, 'level1');
        
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
    
    addRoom(x, y, roomName) {
        if (!this.rooms[x]) {
            this.rooms[x] = [];
        }
        this.rooms[x][y] = new DungeonRoom(this, x, y, roomName);
        this.rooms[x][y].load();
        
        console.log(this.rooms);
    }
    
    changeRoom(x, y) {
        if (x !== this.currentRoomX || y !== this.currentRoomY) {
            this.tweens.add({
                targets: this.cameras.main,
                zoom : 1,
                scrollX: this.cameras.main.scrollX + constants.ROOM_W * (x - this.currentRoomX),
                scrollY: this.cameras.main.scrollY + constants.ROOM_H * (y - this.currentRoomY),
                duration: 250,
                ease: 'Linear',
            });
            this.currentRoomX = x;
            this.currentRoomY = y;
            console.log('Tween add');
        }
    }
    
    update(time, delta) {
        if (!this.pad) {
            return;
        }
        const playerVelocity = 150;
        let nbDown = 0;
    
        let deltaX = this.pad.axes[0].getValue();
        let deltaY = this.pad.axes[1].getValue();
        if (Math.abs(deltaX) < 0.2) {
            deltaX = 0;
        }
        if (Math.abs(deltaY) < 0.2) {
            deltaY = 0;
        }
        
        this.player.body.setVelocityX(playerVelocity * deltaX);
        this.player.body.setVelocityY(playerVelocity * deltaY);
        
        this.rooms[this.currentRoomX][this.currentRoomY].update(time, delta);
    }
}
