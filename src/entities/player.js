import { Entity } from './entity';
import constants from '../constants';
import { inputsEventsCenter } from '../scenes/dungeon-map';

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
        
        this.swordTriggered = false;
        this.swordVisible = false;
        this.swordAngle = 0;
        this.lastVelocityAngle = 0;
    
        this.playerObject = this.game.add.sprite(PLAYER_X, PLAYER_Y, 'player');
        
        this.swordObject = this.game.add.rectangle(PLAYER_X + SWORD_X, PLAYER_Y + SWORD_Y, SWORD_W, SWORD_H, 0xff0000);
        this.swordObject.setOrigin(-0.27, 0.5);
        
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
    
        inputsEventsCenter.on('actionPressed', () => {
            // Just pressed X
            if (!this.swordTriggered) {
                console.log('SWORD !');
                this.swordTriggered = true;
                this.swordAngle = -90;
                this.swordTargetAngle = this.lastVelocityAngle;
            }
        });
    }
    
    update(time, delta, inputData) {
        this.x = this.gameObject.x + this.playerObject.width / 2;
        this.y = this.gameObject.y + this.playerObject.height / 2;
        
        const deltaX = inputData.deltaX || 0;
        const deltaY = inputData.deltaY || 0;
        const actionPressed = inputData.actionPressed;

        this.gameObject.body.setVelocityX(constants.PLAYER_VELOCITY * deltaX);
        this.gameObject.body.setVelocityY(constants.PLAYER_VELOCITY * deltaY);

        if (deltaX !== 0 || deltaY !== 0) {
            this.lastVelocityAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        }
        
        if (this.swordTriggered) {
            this.swordAngle += 10;
            this.swordAngle = Math.min(0, this.swordAngle);
            if (this.swordAngle >= 0) {
                this.swordTriggered = false;
            }
        }
        this.swordVisible = this.swordTriggered;

        this.swordObject.setAngle(this.swordTargetAngle + this.swordAngle);
        this.swordObject.setVisible(this.swordVisible);
    }
}
