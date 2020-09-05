import {SimpleTileLayer} from '../simple-tile-layer';
import {Point} from '../../../../models/cross-code-map';
import Tile = Phaser.Tilemaps.Tile;
import {PolygonDescription} from './node-grid';

export interface BoundaryTracer {
	getContour(layer: SimpleTileLayer): PolygonDescription[];
}
