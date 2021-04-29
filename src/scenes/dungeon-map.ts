//setting game configuration and loading the assets for the loading screen

import * as Phaser from "phaser";
// @ts-ignore
import tilesMap from  '../assets/images/tiles.png';
// @ts-ignore
import playerImage from  '../assets/images/player.png';
// @ts-ignore
import pascalImage from  '../assets/images/mob_pascal.png';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';
import constants from '../constants';
import { DungeonRoom } from '../dungeon-room';
import { Player } from '../entities/player';
import { Pascal } from '../entities/pascal';
import { Entity } from '../entities/entity';

export type InputData = {
    deltaX: number, deltaY: number,
    actionDown?: boolean,
    debugDown?: boolean,
};

//TODO move to index ?
export const inputsEventsCenter = new Phaser.Events.EventEmitter();

export class DungeonMapScene extends Phaser.Scene {
    private rooms = [];
    private currentRoomX = 0;
    private currentRoomY = 0;
    private inputData: InputData = { deltaX: 0, deltaY: 0 };
    private lastInputData: InputData = { deltaX: 0, deltaY: 0 };
    private gameRunning = true;
    public player: Player; // TODO make private
    public mob: Entity; // TODO make private
    private gameOverText: Phaser.GameObjects.Text;
    pad: any;

    constructor () {
        super('DungeonMap');
    }

    preload() {
        //assets we'll use in the loading screen
        this.load.image('player', playerImage);
        this.load.image('pascal', pascalImage);

        this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');

        this.cameras.main.setViewport(0, 0, constants.ROOM_W, constants.ROOM_H);
    }

    create() {
        this.player = new Player(this, 200, 200);
        this.mob = new Pascal(this, 100, 100);
        this.physics.add.overlap(this.player.playerObject, (this.mob as any).gameObject,
            (player, mob) => {
                console.log("COLLIDES");
                if (!this.player.isInvincible) {
                    this.player.addPV(-1);
                    this.player.setInvincible();
                    if (this.player.pv <= 0) {
                        this.gameRunning = false;
                    }
                }
            }
        );

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

        this.gameOverText = this.add.text(constants.ROOM_W/2 - 70, constants.ROOM_H/2 - 20, 'GAME OVER', { font: '26px Courier', color: '#ffffff' });
        this.gameOverText.setDepth(constants.Z_HUD_DEBUG);
        this.gameOverText.setVisible(false);

        //Gamepad detection
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
        }
    }

    update(time, delta) {
        this.updateInputs();
        this.player.update(time, delta, this.inputData);
        this.mob.update(time, delta, this.inputData);
        this.rooms[this.currentRoomX][this.currentRoomY].update(time, delta);
        this.gameOverText.setVisible(!this.gameRunning);
    }

    updateInputs() {
        this.lastInputData = this.inputData;
        if (!!this.pad) {
            // Joystick axes
            let deltaX = this.pad.axes[0].getValue();
            let deltaY = this.pad.axes[1].getValue();
            if (Math.abs(deltaX) < 0.2) {
                deltaX = 0;
            }
            if (Math.abs(deltaY) < 0.2) {
                deltaY = 0;
            }

            // TODO control mapping
            const debugDown = this.pad.buttons[8].pressed;
            const actionDown = this.pad.buttons[2].pressed;
            this.inputData = {
                deltaX, deltaY,
                actionDown,
                debugDown,
            };
            if (!this.lastInputData.debugDown && debugDown) {
                inputsEventsCenter.emit('debugPressed');
            }
            if (!this.lastInputData.actionDown && actionDown) {
                console.log('actionPressed');
                inputsEventsCenter.emit('actionPressed');
            }
        }
    }
}
