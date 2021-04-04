import constants from './constants';

export class DungeonRoom {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
    }
    
    load() {
        // Charge les tilemaps, mobs etc liés a la room
    
        const map = this.game.make.tilemap({ key: 'level1' });
        const tileset = map.addTilesetImage('dungeon_tiles_0_retouche', 'dungeonTiles');
        const backgroundTiles = map.createLayer("background", tileset, this.x * constants.ROOM_W, this.y * constants.ROOM_H);
        const borderTiles = map.createLayer("Border", tileset, this.x * constants.ROOM_W, this.y * constants.ROOM_H);
        backgroundTiles.setDepth(constants.Z_BACKGROUND);
        borderTiles.setDepth(constants.Z_BORDERS);
        
        
        // TODO lights
        //const lights = map.createLayer("lights", tileset, 0, 0); // FIXME animated tiles are not working
        
        //TODO setCollisionByProperty
        //borderTiles.setCollisionByProperty({ collides: true });
        borderTiles.setCollision([ 280, 348, 279 ]);
    
        this.game.physics.add.collider(this.game.player, borderTiles);
    }
    
    update() {
        // Update des entités dans la room
    }
    
    transitionTo() {
        // Passe à une autre room (caméra...)
    }
}
