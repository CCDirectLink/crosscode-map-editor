import {AUTOTILE_CONFIG, AutotileConfig} from './autotile-config';
import {Injectable} from '@angular/core';
import {AUTOTILE_FILL_TYPE, FillType} from './constants';

@Injectable({
	providedIn: 'root'
})
export class AutotileConfigService {
	
	constructor() {
	
	}
	
	getAutotileConfig(tilesetName: string, tile: number): AutotileConfig | null {
		const configs = AUTOTILE_CONFIG[tilesetName];
		if (!configs) {
			return null;
		}
		for (const config of configs) {
			const start = this.getTile(config.start.x, config.start.y, config.tileCountX);
			const end = start + config.type;
			
			if (tile >= start && tile < end || tile >= (start + config.tileCountX) && tile < (end + config.tileCountX)) {
				return config;
			}
		}
		
		return null;
	}
	
	getGfx(fillType: keyof FillType, config: AutotileConfig) {
		const offsets = AUTOTILE_FILL_TYPE[config.type][fillType];
		const offset = offsets[Math.floor(Math.random() * offsets.length)];
		
		const start = this.getTile(config.start.x + offset.x, config.start.y + offset.y, config.tileCountX);
		
	}
	
	private getTile(x: number, y: number, tileCountX: number) {
		return y * tileCountX + x + 1;
	}
	
	
}
