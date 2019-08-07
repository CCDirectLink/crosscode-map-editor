import {Injectable} from '@angular/core';
import {CCMapLayer} from '../../shared/phaser/tilemap/cc-map-layer';
import {AutotileConfigService} from './autotile-config.service';
import {Point} from '../../models/cross-code-map';
import {CHECK_DIR, CheckDir, FILL_TYPE} from '../height-map/constants';

interface TileData {
	index: number;
	pos: Point;
	fill: FILL_TYPE;
}

@Injectable({
	providedIn: 'root'
})
export class AutotileService {
	
	constructor(
		private autotilConfig: AutotileConfigService
	) {
	}
	
	public getActualTile(layer: CCMapLayer, x: number, y: number, tile: number) {
		const config = this.autotilConfig.getAutotileConfig(layer.details.tilesetName, tile);
		if (!config) {
			return tile;
		}
		const tileData: TileData = {
			pos: {x: x, y: y},
			fill: FILL_TYPE.SQUARE,
			index: tile
		};
		
		const n = this.getOther(layer, tileData, CHECK_DIR.NORTH);
		
	}
	
	private replaceTile(tile: tileData)
	
	private replaceRoundTile(layer: CCMapLayer, tile: TileData) {
		const n = this.getOther(layer, tile, CHECK_DIR.NORTH);
		const e = this.getOther(layer, tile, CHECK_DIR.EAST);
		const w = this.getOther(layer, tile, CHECK_DIR.WEST);
		const s = this.getOther(layer, tile, CHECK_DIR.SOUTH);
		
		if (n && e && (!s || s >= n) && (!w || w >= n) && n === e) {
			return FILL_TYPE.NORTHEAST;
		} else if ((!n || n >= e) && e && s && (!w || w >= e) && e === s) {
			return FILL_TYPE.SOUTHEAST;
		} else if ((!n || n >= w) && (!e || e >= w) && s && w && s === w) {
			return FILL_TYPE.SOUTHWEST;
		} else if (n && (!e || e >= n) && (!s || s >= n) && w && n === w) {
			return FILL_TYPE.NORTHWEST;
		} else {
			return FILL_TYPE.SQUARE;
		}
	}
	
	private getOther(layer: CCMapLayer, tile: TileData, dir: CheckDir): TileData {
		const newPos = {
			x: tile.pos.x + dir.dx,
			y: tile.pos.y + dir.dy
		};
		
		const out: TileData = {
			pos: newPos,
			index: tile.index,
			fill: FILL_TYPE.ROUND
		};
		
		if (newPos.x < 0 || newPos.y < 0 || newPos.x > layer.details.width || newPos.y > layer.details.height) {
			// out of bounds, fake neighbour filled tile
			out.fill = FILL_TYPE.SQUARE;
		} else {
			out.index = layer.getPhaserLayer()!.getTileAt(newPos.x, newPos.y, true).index;
		}
		
		return out;
	}
}
