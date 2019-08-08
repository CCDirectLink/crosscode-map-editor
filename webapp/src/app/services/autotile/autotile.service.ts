import {Injectable} from '@angular/core';
import {CCMapLayer} from '../../shared/phaser/tilemap/cc-map-layer';
import {AutotileConfigService} from './autotile-config.service';
import {Point} from '../../models/cross-code-map';
import {CHECK_DIR, CHECK_ITERATE, CheckDir} from '../height-map/constants';
import {AutotileConfig} from './autotile-config';
import {FillType} from './constants';

interface TileData {
	pos: Point;
	update: boolean;
	fill: keyof FillType;
}

@Injectable({
	providedIn: 'root'
})
export class AutotileService {
	
	constructor(
		private autotilConfig: AutotileConfigService
	) {
	}
	
	public drawTile(layer: CCMapLayer, x: number, y: number, tile: number) {
		const config = this.autotilConfig.getAutotileConfig(layer.details.tilesetName, tile);
		if (!config) {
			return tile;
		}
		const tileData: TileData = {
			pos: {x: x, y: y},
			fill: 'XXXX',
			update: true
		};
		
		
		const tilesToUpdate = CHECK_ITERATE
			.map(v => this.getOther(config, layer, tileData, CHECK_DIR[v]))
			.filter(tile => tile.update);
		
		tilesToUpdate.push(tileData);
		
		for (const tileData of tilesToUpdate) {
			tileData.fill = 'XXXX';
			this.drawSingleTile(layer, config, tileData);
		}
		
		for (const tileData of tilesToUpdate) {
			this.updateTile(config, layer, tileData);
		}
		
	}
	
	private updateTile(config: AutotileConfig, layer: CCMapLayer, tile: TileData) {
		const n = this.getOther(config, layer, tile, CHECK_DIR.NORTH);
		const e = this.getOther(config, layer, tile, CHECK_DIR.EAST);
		const s = this.getOther(config, layer, tile, CHECK_DIR.SOUTH);
		const w = this.getOther(config, layer, tile, CHECK_DIR.WEST);
		
		const nw = this.getOther(config, layer, tile, CHECK_DIR.NW);
		const ne = this.getOther(config, layer, tile, CHECK_DIR.NE);
		const se = this.getOther(config, layer, tile, CHECK_DIR.SE);
		const sw = this.getOther(config, layer, tile, CHECK_DIR.SW);
		
		let fillType = '';
		
		if (this.checkAt(w, 1) && this.checkAt(nw, 2) && this.checkAt(n, 3)) {
			fillType += 'X';
		} else {
			fillType += 'O';
		}
		
		if (this.checkAt(n, 2) && this.checkAt(ne, 3) && this.checkAt(e, 0)) {
			fillType += 'X';
		} else {
			fillType += 'O';
		}
		
		if (this.checkAt(e, 3) && this.checkAt(se, 0) && this.checkAt(s, 1)) {
			fillType += 'X';
		} else {
			fillType += 'O';
		}
		
		if (this.checkAt(s, 0) && this.checkAt(sw, 1) && this.checkAt(w, 2)) {
			fillType += 'X';
		} else {
			fillType += 'O';
		}
		tile.fill = fillType as keyof FillType;
		this.drawSingleTile(layer, config, tile);
	}
	
	private checkAt(tile: TileData, index: number) {
		return tile.fill.charAt(index) === 'X';
	}
	
	private drawSingleTile(layer: CCMapLayer, config: AutotileConfig, tile: TileData) {
		if (!tile.fill) {
			return;
		}
		const index = this.autotilConfig.getGfx(tile.fill, config);
		layer.getPhaserLayer()!.putTileAt(index, tile.pos.x, tile.pos.y, false);
	}
	
	private getOther(config: AutotileConfig, layer: CCMapLayer, tile: TileData, dir: CheckDir): TileData {
		const newPos = {
			x: tile.pos.x + dir.dx,
			y: tile.pos.y + dir.dy
		};
		
		const out: TileData = <any>{
			pos: newPos,
			fill: 'OOOO'
		};
		
		if (newPos.x < 0 || newPos.y < 0 || newPos.x >= layer.details.width || newPos.y >= layer.details.height) {
			out.fill = 'XXXX';
			out.update = false;
			return out;
		}
		
		out.update = true;
		const index = layer.getPhaserLayer()!.getTileAt(newPos.x, newPos.y, true).index;
		const fill = this.autotilConfig.getFillType(config, index);
		if (fill) {
			out.fill = fill;
		} else {
			out.update = false;
		}
		
		return out;
	}
}
