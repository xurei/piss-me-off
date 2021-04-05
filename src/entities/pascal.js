import { Entity } from './entity';
import constants from '../constants';

export class Pascal extends Entity {
    constructor(game, x, y) {
        super();
        this.game = game;
        this.x = x;
        this.y = y;
        this.gameObject = this.game.physics.add.sprite(this.x, this.y, 'pascal');
        this.gameObject.setDepth(constants.Z_PLAYER);
        this.gameObject.body.setVelocityX(constants.MOB_VELOCITY);
    }
    
    update(time, delta) {
        if (this.gameObject.x >= constants.ROOM_W - constants.TILE_SIZE*1.5) {
            this.gameObject.body.setVelocityX(-constants.MOB_VELOCITY);
        }
        else if (this.gameObject.x <= constants.TILE_SIZE*1.5) {
            this.gameObject.body.setVelocityX(constants.MOB_VELOCITY);
        }
    }
}
