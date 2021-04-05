import constants from './constants';
import { setPlayerRoomPos, setRoomPos } from './scenes/hud';

export class DungeonRoom {
    constructor(game, x, y, roomName) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.roomName = roomName;
    }
    
    load() {
        // Charge les tilemaps, mobs etc liés a la room
    
        const map = this.game.make.tilemap({ key: this.roomName });
        const tileset = map.addTilesetImage('dungeon_tiles_0_retouche', 'dungeonTiles');
        const backgroundTiles = map.createLayer("background", tileset, this.x * constants.ROOM_W, this.y * constants.ROOM_H);
        const borderTiles = map.createLayer("Border", tileset, this.x * constants.ROOM_W, this.y * constants.ROOM_H);
        
        //TODO make an effective contentTiles
        const contentTiles = map.createLayer("Tile Layer 8", tileset, this.x * constants.ROOM_W, this.y * constants.ROOM_H);
        
        backgroundTiles.setDepth(constants.Z_BACKGROUND);
        borderTiles.setDepth(constants.Z_BORDERS);
        contentTiles.setDepth(constants.Z_BORDERS);
        
        
        // TODO lights
        //const lights = map.createLayer("lights", tileset, 0, 0); // FIXME animated tiles are not working
        
        //TODO setCollisionByProperty
        //borderTiles.setCollisionByProperty({ collides: true });
        borderTiles.setCollision([ 280, 348, 279 ]);
    
        this.game.physics.add.collider(this.game.player, borderTiles);
        this.game.physics.add.collider(this.game.mob, borderTiles);
    }
    
    update(time, delta) {
        const player = this.game.player;
        
        // Cochonaille
        const py = player.y - constants.ROOM_H * this.y;
        const px = player.x - constants.ROOM_W * this.x;
        setPlayerRoomPos(px, py);
        setRoomPos(this.x, this.y);
        
        //console.log(px, py);
        
        if (constants.ROOM_W / 2 - constants.TILE_SIZE/2 < px && px < constants.ROOM_W / 2 + constants.TILE_SIZE/2) {
            if (py > constants.ROOM_H - constants.TILE_SIZE && player.body.velocity.y > 1) {
                this.game.changeRoom(this.x, this.y + 1);
            }
            else if (py < constants.TILE_SIZE && player.body.velocity.y < -1) {
                this.game.changeRoom(this.x, this.y - 1);
            }
        }
        else if (constants.ROOM_H / 2 - constants.TILE_SIZE/2 < py && py < constants.ROOM_H / 2 + constants.TILE_SIZE/2) {
            if (px > constants.ROOM_W - constants.TILE_SIZE && player.body.velocity.x > 1) {
                this.game.changeRoom(this.x + 1, this.y);
            }
            else if (px < constants.TILE_SIZE && player.body.velocity.x < -1) {
                this.game.changeRoom(this.x - 1, this.y);
            }
        }
    }
    
    transitionTo() {
        // Passe à une autre room (caméra...)
    }
}
