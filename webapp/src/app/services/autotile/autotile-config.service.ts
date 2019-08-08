import {AUTOTILE_CONFIG, AutotileConfig, AutotileType} from './autotile-config';
import {Injectable} from '@angular/core';
import {AUTOTILE_FILL_TYPE, FillType} from './constants';
import {Point} from '../../models/cross-code-map';
import {Helper} from '../../shared/phaser/helper';

// TODO: shouldn't be a service. Is only used by autotile-service.
//  mapping variable could be static and only initialized on first instantiation
//  or maybe move initialization to config bottom
@Injectable({
	providedIn: 'root'
})
export class AutotileConfigService {
	
	private mapping: Map<number, keyof FillType> = new Map();
	
	constructor() {
		const filltypes: FillType = AUTOTILE_FILL_TYPE[AutotileType.EXTENDED];
		
		for (const key of Object.keys(filltypes) as (keyof FillType)[]) {
			const offsets = filltypes[key];
			offsets.forEach(offset => this.mapping.set(this.getMappingKey(offset), key));
		}
		
		console.log(this.mapping);
	}
	
	getAutotileConfig(tilesetName: string, tile: number): AutotileConfig | null {
		const configs = AUTOTILE_CONFIG[tilesetName];
		if (!configs) {
			return null;
		}
		for (const config of configs) {
			if (this.getFillType(config, tile)) {
				return config;
			}
		}
		
		return null;
	}
	
	getFillType(config: AutotileConfig, tile: number): keyof FillType | undefined {
		const pos = Helper.indexToPoint(tile, config.tileCountX);
		pos.x -= config.start.x;
		pos.y -= config.start.y;
		
		if (pos.x >= 0 && pos.x < config.type && (pos.y === 0 || pos.y === 1)) {
			const out = this.mapping.get(this.getMappingKey(pos));
			if (!out) {
				throw new Error('filltype not found, help');
			}
			return out;
		}
		
		return undefined;
	}
	
	getGfx(fillType: keyof FillType, config: AutotileConfig) {
		const offsets = AUTOTILE_FILL_TYPE[config.type][fillType];
		const offset = offsets[Math.floor(Math.random() * offsets.length)];
		
		return this.getTile(config.start.x + offset.x, config.start.y + offset.y, config.tileCountX);
	}
	
	private getTile(x: number, y: number, tileCountX: number) {
		return y * tileCountX + x + 1;
	}
	
	private getMappingKey(p: Point) {
		return p.y * 20 + p.x;
	}
	
	
}
