import { SimpleTileLayer } from '../simple-tile-layer';
import { PolygonDescription } from './node-grid';

export interface BoundaryTracer {
	getContour(layer: SimpleTileLayer): PolygonDescription[];
}
