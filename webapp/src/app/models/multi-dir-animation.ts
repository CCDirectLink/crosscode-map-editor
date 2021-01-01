import { TileSheet } from './tile-sheet';

export interface MultiDirAnimation {
    DOCTYPE: 'MULTI_DIR_ANIMATION';
    name: string;
    namedSheets: {[name: string]: TileSheet};
    sheet: TileSheet | string;
}
