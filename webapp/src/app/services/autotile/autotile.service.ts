import { Injectable, inject } from '@angular/core';
import { Point } from '../../models/cross-code-map';
import { CHECK_DIR, CHECK_ITERATE, CheckDir } from '../height-map/heightmap.constants';
import { CCMapLayer } from '../phaser/tilemap/cc-map-layer';
import { AutotileConfig, FillType } from './autotile.constants';
import { GfxMapper } from './gfx-mapper';
import { customPutTileAt } from '../phaser/tilemap/layer-helper';
import { PhaserEventsService } from '../phaser/phaser-events.service';
import { combineLatest } from 'rxjs';
import { MapLoaderService } from '../map-loader.service';
import { GlobalEventsService } from '../global-events.service';
import { JsonLoaderService } from '../json-loader.service';

interface TileData {
	pos: Point;
	update: boolean;
	fill: keyof FillType | undefined;
}

@Injectable({
	providedIn: 'root'
})
export class AutotileService {
	
	private gfxMapper: GfxMapper;
	
	constructor() {
		const phaserEvents = inject(PhaserEventsService);
		const mapLoader = inject(MapLoaderService);
		const events = inject(GlobalEventsService);
		const jsonLoader = inject(JsonLoaderService);

		this.gfxMapper = new GfxMapper(jsonLoader);
		combineLatest([
			phaserEvents.changeSelectedTiles.asObservable(),
			mapLoader.selectedLayer.asObservable()
		]).subscribe(([tiles, layer]) => {
			if (!layer) {
				events.isAutotile.next(false);
				return;
			}
			let autotile = false;
			for (const tile of tiles) {
				const config = this.gfxMapper.getAutotileConfig(layer.details.tilesetName, tile.id, false);
				if (config) {
					autotile = true;
					break;
				}
			}
			events.isAutotile.next(autotile);
		});
	}
	
	public drawTile(layer: CCMapLayer, x: number, y: number, tile: number, checkCliff = true) {
		const config = this.gfxMapper.getAutotileConfig(layer.details.tilesetName, tile, checkCliff);
		if (!config) {
			return;
		}
		const tileData: TileData = {
			pos: {x: x, y: y},
			fill: 'XXXX',
			update: true
		};
		if (!config.isCliff) {
			this.drawSingleTile(layer, config.config, tileData);
		}
		const tilesToUpdate = CHECK_ITERATE
			.map(v => this.getOther(config.config, layer, tileData, CHECK_DIR[v]))
			.filter(tile => tile.update);
		
		for (const tileData of tilesToUpdate) {
			tileData.fill = 'XXXX';
			this.drawSingleTile(layer, config.config, tileData);
		}
		
		if (!config.isCliff) {
			tilesToUpdate.push(tileData);
		}
		
		for (const tileData of tilesToUpdate) {
			this.updateTile(config.config, layer, tileData);
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
		
		// 4x4 needs special handling, corners are ignored
		if (config.type === '4x4') {
			if (this.checkAt(n, 2)) {
				fillType += 'X';
			} else {
				fillType += 'O';
			}
			if (this.checkAt(e, 3)) {
				fillType += 'X';
			} else {
				fillType += 'O';
			}
			if (this.checkAt(s, 0)) {
				fillType += 'X';
			} else {
				fillType += 'O';
			}
			if (this.checkAt(w, 1)) {
				fillType += 'X';
			} else {
				fillType += 'O';
			}
		} else {
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
		}
		
		tile.fill = fillType as keyof FillType;
		this.drawSingleTile(layer, config, tile);
	}
	
	private checkAt(tile: TileData, index: number) {
		return tile.fill && tile.fill.charAt(index) === 'X';
	}
	
	private drawSingleTile(layer: CCMapLayer, config: AutotileConfig, tile: TileData) {
		if (!tile.fill) {
			return;
		}
		const index = this.gfxMapper.getGfx(tile.fill, config);
		customPutTileAt(index, tile.pos.x, tile.pos.y, layer.getPhaserLayer().layer);
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
		const index = layer.getPhaserLayer()!.getTileAt(newPos.x, newPos.y, true).index;
		if (index === 0) {
			if (config.mergeWithEmpty) {
				out.fill = 'XXXX';
			} else {
				out.fill = 'OOOO';
			}
			out.update = false;
			return out;
		}
		
		out.update = true;
		const fill = this.gfxMapper.getFillType(config, index);
		if (fill) {
			out.fill = fill;
		} else {
			out.update = false;
			out.fill = this.gfxMapper.getFillType(config, index, true) || out.fill;
		}
		
		return out;
	}
}
