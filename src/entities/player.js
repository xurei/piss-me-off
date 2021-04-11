import { Entity } from './entity';
import constants from '../constants';

const PLAYER_X = 4.5;
const PLAYER_Y = 8;
const SWORD_X = 1;
const SWORD_Y = 1;
const SWORD_W = 20;
const SWORD_H = 3;

export class Player extends Entity {
    constructor(game, x, y) {
        super();
        this.game = game;
        this.x = x;
        this.y = y;
        
        this.swordVisible = false;
        this.swordAngle = 0;
        this.lastVelocityAngle = 0;
    
        this.playerObject = this.game.add.sprite(PLAYER_X, PLAYER_Y, 'player');
        
        this.swordObject = this.game.add.rectangle(PLAYER_X + SWORD_X, PLAYER_Y + SWORD_Y, SWORD_W, SWORD_H, 0xff0000);
        this.swordObject.setOrigin(-0.40, 0.5);
        
        this.container = this.game.add.container(this.x, this.y);
        this.container.add(this.playerObject);
        this.container.add(this.swordObject);
        this.container.setDepth(constants.Z_PLAYER);
        
        this.gameObject = this.game.physics.add.existing(this.container);
        //this.gameObject.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, 0, 100, 50));
        this.gameObject.body.setSize(this.playerObject.width, this.playerObject.height);
        
        /*this.gameObject = this.game.physics.add.sprite(this.x, this.y, 'player');
        this.gameObject.setDepth(constants.Z_PLAYER);
        this.swordGameObject = this.game.add.rectangle(this.x+7, this.y+1, 8, 3, 0xff0000);
        this.swordGameObject.setDepth(constants.Z_PLAYER);*/
    }
    
    update(time, delta) {
        this.x = this.gameObject.x + this.playerObject.width / 2;
        this.y = this.gameObject.y + this.playerObject.height / 2;
        
        /*if (time < 4000) {
            console.log(this.gameObject);
        }*/
        //console.log(time);
        if (!!this.game.pad) {
            let deltaX = this.game.pad.axes[0].getValue();
            let deltaY = this.game.pad.axes[1].getValue();
            if (Math.abs(deltaX) < 0.2) {
                deltaX = 0;
            }
            if (Math.abs(deltaY) < 0.2) {
                deltaY = 0;
            }

            //this.swordGameObject.setX(this.gameObject.x + 7);
            //this.swordGameObject.setY(this.gameObject.y + 1);
            this.gameObject.body.setVelocityX(constants.PLAYER_VELOCITY * deltaX);
            this.gameObject.body.setVelocityY(constants.PLAYER_VELOCITY * deltaY);
    
            if (deltaX !== 0 || deltaY !== 0) {
                this.lastVelocityAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            }
            
            let xPressed = this.game.pad.buttons[2].pressed;
            
            if (!this.swordVisible && xPressed) {
                // Just pressed X
                this.swordAngle = -90;
                this.swordTargetAngle = this.lastVelocityAngle;
            }
            else if (xPressed) {
                this.swordAngle += 10;
                this.swordAngle = Math.min(0, this.swordAngle);
            }
            this.swordVisible = xPressed;
    
            this.swordObject.setAngle(this.swordTargetAngle + this.swordAngle);
            
            //this.swordObject.setAngle(0);
            
            /*//console.log(this.game.pad.buttons[2]);
            if (xPressed) {

            }*/
        }
    
        this.swordObject.setVisible(this.swordVisible);
    }
}
