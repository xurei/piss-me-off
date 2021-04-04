//setting game configuration and loading the assets for the loading screen

import Phaser from "phaser";
import tilesMap from  '../assets/images/tiles.png';
import playerImage from  '../assets/images/player.png';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';
import constants from '../constants';
import { DungeonRoom } from '../dungeon-room';

export class HUDScene extends Phaser.Scene {
    constructor () {
        super('HUD');
    }
    
    preload() {
    
    }
    
    create() {
        const sidebar_placeholder = this.add.rectangle(
            constants.ROOM_W + constants.SIDEBAR_W/2, constants.ROOM_H/2,
            constants.SIDEBAR_W, constants.ROOM_H, 0xff0000);
    
        this.debugPadText = this.add.text(10, 30, '', { font: '10px Courier', fill: '#ffffff' });
        this.debugPadText.setText('waiting for gamepad');
        this.debugPadText.setDepth(constants.Z_HUD_DEBUG);
    }
    
    update(time, delta) {
        this.debugPad(delta);
    }
    
    debugPad(delta) {
        let debug = [];
        let pads = this.input.gamepad.gamepads;
        // let pads = this.input.gamepad.getAll();
        // let pads = navigator.getGamepads();
    
        for (let i = 0; i < pads.length; i++)
        {
            let pad = pads[i];
        
            if (!pad) {
                continue;
            }
        
            //  Timestamp, index. ID
            //debug.push(pad.id);
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
            
            const fps = Math.round(1000/delta * 100)/100;
        
            debug.push(axes);
            debug.push('');
            debug.push('FPS:' + fps);
        }
    
        this.debugPadText.setText(debug);
    }
}
