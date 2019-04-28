import { Point } from 'phaser-ce';

export interface ISelectedTiles {
    tiles: {
        id: number;
        offset: Point;
    }[];
    size: Point;
}
