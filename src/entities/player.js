import { Entity } from './entity';
import constants from '../constants';

export class Player extends Entity {
    constructor(game, x, y) {
        super();
        this.game = game;
        this.x = x;
        this.y = y;
        this.gameObject = this.game.physics.add.sprite(this.x, this.y, 'player');
        this.gameObject.setDepth(constants.Z_PLAYER);
    }
    
    update(time, delta) {
        this.x = this.gameObject.x;
        this.y = this.gameObject.y;
        if (!!this.game.pad) {
            let deltaX = this.game.pad.axes[0].getValue();
            let deltaY = this.game.pad.axes[1].getValue();
            if (Math.abs(deltaX) < 0.2) {
                deltaX = 0;
            }
            if (Math.abs(deltaY) < 0.2) {
                deltaY = 0;
            }
            this.gameObject.body.setVelocityX(constants.PLAYER_VELOCITY * deltaX);
            this.gameObject.body.setVelocityY(constants.PLAYER_VELOCITY * deltaY);
        }
    }
}
