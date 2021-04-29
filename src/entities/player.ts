import { Entity } from './entity';
import constants from '../constants';
import { DungeonMapScene, InputData, inputsEventsCenter } from '../scenes/dungeon-map';
import { setLife } from '../scenes/hud';

const SWORD_X = 1;
const SWORD_Y = 1;
const SWORD_W = 20;
const SWORD_H = 3;

export class Player extends Entity {
    private _pv: number;
    private invincibilityFrames: number = 0;
    private swordTriggered: boolean = false;
    private swordVisible: boolean = false;
    private swordAngle: number = 0;
    private swordTargetAngle: number = 0;
    private lastVelocityAngle: number = 0;

    //private playerSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    public playerObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // TODO make this private

    private swordSprite: Phaser.GameObjects.Shape;
    private swordObject: Phaser.GameObjects.GameObject & { body: Phaser.Physics.Arcade.Body; };

    public get x() { return this.playerObject.x };
    public get y() { return this.playerObject.y };
    public get isInvincible() : boolean { return this.invincibilityFrames !== 0; };
    public get pv() { return this._pv };

    constructor(map : DungeonMapScene, x, y) {
        super(map);
        this._pv = 6;

        //this.playerSprite = this.dungeonMap.physics.add.sprite(PLAYER_X, PLAYER_Y, 'player');
        this.playerObject = this.dungeonMap.physics.add.sprite(x, y, 'player');
        this.playerObject.setDepth(constants.Z_PLAYER);

        this.swordSprite = this.dungeonMap.add.rectangle(x + SWORD_X, y + SWORD_Y, SWORD_W, SWORD_H, 0xff0000);
        this.swordSprite.setOrigin(-0.27, 0.5);
        this.swordSprite.setDepth(constants.Z_PLAYER);
        this.swordObject = this.dungeonMap.physics.add.existing(this.swordSprite) as any;
        this.swordObject.body.debugShowVelocity = false;

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

    public addPV(pvDelta: number) {
        this._pv += pvDelta;
    }

    public setInvincible() {
        this.invincibilityFrames = 60;
    }

    update(time, delta, inputData: InputData) {
        setLife(this.pv, this.invincibilityFrames);

        const deltaX = inputData.deltaX || 0;
        const deltaY = inputData.deltaY || 0;
        if (this.invincibilityFrames > 0) {
            this.invincibilityFrames--;
        }

        //Positions and velocity updates
        this.swordSprite.setX(this.x);
        this.swordSprite.setY(this.y);
        this.playerObject.body.setVelocityX(constants.PLAYER_VELOCITY * deltaX);
        this.playerObject.body.setVelocityY(constants.PLAYER_VELOCITY * deltaY);
        this.swordObject.body.setVelocityX(constants.PLAYER_VELOCITY * deltaX);
        this.swordObject.body.setVelocityY(constants.PLAYER_VELOCITY * deltaY);

        if (deltaX !== 0 || deltaY !== 0) {
            this.lastVelocityAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        }

        this.swordVisible = (inputData.actionDown || this.swordTriggered);

        if (this.swordTriggered) {
            this.swordAngle += 10;
            this.swordAngle = Math.min(0, this.swordAngle);
            if (this.swordAngle >= 0) {
                this.swordTriggered = false;
            }
        }

        if (this.swordVisible) {
            //Update sword position
            this.swordObject.body.setVelocityX(constants.PLAYER_VELOCITY * deltaX);
            this.swordObject.body.setVelocityY(constants.PLAYER_VELOCITY * deltaY);
        }
        this.swordSprite.setVisible(this.swordVisible);
        this.swordObject.body.debugBodyColor = this.swordVisible ? 0x00ff0000 : 0x00008000;

        //this.swordObject.setAngle(this.swordTargetAngle + this.swordAngle);
    }
}
