import { DungeonMapScene, InputData } from '../scenes/dungeon-map';

export class Entity {
    protected dungeonMap: DungeonMapScene;

    constructor(map) {
        this.dungeonMap = map;
    }

    update(time, delta, inputData : InputData) {

    }
}
