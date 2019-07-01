import {Point} from './cross-code-map';

export interface ISelectedTiles {
    tiles: {
        id: number;
        offset: Point;
    }[];
    size: Point;
}
