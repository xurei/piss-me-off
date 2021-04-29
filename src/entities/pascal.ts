import { Entity } from './entity';
import constants from '../constants';
import { DungeonMapScene } from '../scenes/dungeon-map';

export class Pascal extends Entity {
    private gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _pv: number;

    constructor(map : DungeonMapScene, x, y) {
        super(map);
        this._pv = 3;
        this.gameObject = this.dungeonMap.physics.add.sprite(x, y, 'pascal');
        this.gameObject.setDepth(constants.Z_PLAYER);
        this.gameObject.body.setVelocityX(constants.MOB_VELOCITY);
    }

    update(time, delta, inputData) {
        if (this.gameObject.x >= constants.ROOM_W - constants.TILE_SIZE*1.5) {
            this.gameObject.body.setVelocityX(-constants.MOB_VELOCITY);
        }
        else if (this.gameObject.x <= constants.TILE_SIZE*1.5) {
            this.gameObject.body.setVelocityX(constants.MOB_VELOCITY);
        }
    }
}
