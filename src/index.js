import Phaser from 'phaser';
import logoImg from './assets/logo.png';

import { BootScene } from './scenes/boot';
import { MainMenuScene } from './scenes/main-menu';
import { DungeonMapScene } from './scenes/dungeon-map';
import constants from './constants';
import { HUDScene } from './scenes/hud';

class MyGame extends Phaser.Scene
{
    preload () {
        this.load.image('logo', logoImg);
    }
    
    create () {
        const logo = this.add.image(400, 150, 'logo');
      
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

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 300 },
            debug: false,
        }
    },
    input: {
        gamepad: true,
    },
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: constants.ROOM_W + constants.SIDEBAR_W,
        height: constants.ROOM_H,
        zoom: 3,
    },
    scene: [ BootScene, MainMenuScene, DungeonMapScene, HUDScene ],
});
