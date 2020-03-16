import {SimpleTileLayer} from '../simple-tile-layer';
import {Point} from '../../../../models/cross-code-map';
import Tile = Phaser.Tilemaps.Tile;

export interface BoundaryTracer {
	getContour(tiles: Set<Tile>, layer: SimpleTileLayer): { path: Point[], holes: Point[][] };
}
