import * as Phaser from 'phaser-ce';

export interface ISelectedTiles {
    tiles: {
        id: number;
        offset: Phaser.Point;
    }[];
    size: Phaser.Point;
}
