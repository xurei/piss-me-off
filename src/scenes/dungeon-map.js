//setting game configuration and loading the assets for the loading screen

import Phaser from "phaser";
import tilesMap from  '../assets/images/tiles.png';
import playerImage from  '../assets/images/player.png';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';

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
    
        const map = this.make.tilemap({ key: 'level1' });
        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage('dungeon_tiles_0_retouche', 'dungeonTiles');
    
        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const backgroundTiles = map.createLayer("background", tileset, 0, 0);
        const borderTiles = map.createLayer("Border", tileset, 0, 0);
        //borderTiles.setCollisionByProperty({ collides: true });
        borderTiles.setCollision([ 280, 348, 279 ]);
        
        
        /*const debugGraphics = this.add.graphics().setAlpha(0.75);
        borderTiles.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });*/
        
        
        const lights = map.createLayer("lights", tileset, 0, 0); // FIXME animated tiles are not working
        //console.log(animatedTiles);
        this.sys.animatedTiles.init(map);
        //const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
        
        this.player = this.physics.add.sprite(200, 200, 'player');
        console.log('create2');
    
        this.physics.add.collider(this.player, borderTiles);
    
    
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
    
        this.debugPadText = this.add.text(10, 30, '', { font: '10px Courier', fill: '#ffffff' });
        this.debugPadText.setText('waiting for gamepad');
    }
    
    update(time, delta) {
        if (!this.pad) {
            return;
        }
        const playerVelocity = 580;
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
        
        this.debugPad();
    }
    
    debugPad() {
        let debug = [];
        let pads = this.input.gamepad.gamepads;
        // let pads = this.input.gamepad.getAll();
        // let pads = navigator.getGamepads();
    
        for (let i = 0; i < pads.length; i++)
        {
            let pad = pads[i];
        
            if (!pad)
            {
                continue;
            }
        
            //  Timestamp, index. ID
            debug.push(pad.id);
            debug.push('Index: ' + pad.index + ' Timestamp: ' + pad.timestamp);
        
            //  Buttons
        
            let buttons = '';
        
            for (let b = 0; b < pad.buttons.length; b++)
            {
                let button = pad.buttons[b];
            
                buttons = buttons.concat('B' + button.index + ': ' + button.value + '  ');
                // buttons = buttons.concat('B' + b + ': ' + button.value + '  ');
            
                if (b === 8)
                {
                    debug.push(buttons);
                    buttons = '';
                }
            }
        
            debug.push(buttons);
        
            //  Axis
        
            let axes = '';
        
            for (let a = 0; a < pad.axes.length; a++)
            {
                let axis = pad.axes[a];
            
                axes = axes.concat('A' + axis.index + ': ' + Math.round(axis.getValue()*100)/100 + '  ');
                // axes = axes.concat('A' + a + ': ' + axis + '  ');
            
                if (a === 1)
                {
                    debug.push(axes);
                    axes = '';
                }
            }
        
            debug.push(axes);
            debug.push('');
        }
    
        this.debugPadText.setText(debug);
    }
}
