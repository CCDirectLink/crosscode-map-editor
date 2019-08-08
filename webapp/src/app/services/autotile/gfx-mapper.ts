import {AUTOTILE_CONFIG, AutotileConfig, AutotileType} from './autotile-config';
import {FILL_TYPE, FILL_TYPE_CLIFF, FILL_TYPE_CLIFF_ALT, FILL_TYPE_CLIFF_BORDER, FillType} from './autotile.constants';
import {Point} from '../../models/cross-code-map';
import {Helper} from '../../shared/phaser/helper';
import {Vec2} from '../../shared/phaser/vec2';
import {CHIPSET_CONFIG} from '../height-map/chipset-config';

export class GfxMapper {
	
	private mapping = new Map<number, keyof FillType>();
	private cliffBorderMapping = new Map<number, keyof FillType>();
	private cliffMapping = new Map<number, keyof FillType>();
	private cliffAltMapping = new Map<number, keyof FillType>();
	
	constructor() {
		const fillType: FillType = FILL_TYPE[AutotileType.EXTENDED];
		
		this.generateMapping(this.mapping, fillType);
		this.generateMapping(this.cliffBorderMapping, FILL_TYPE_CLIFF_BORDER);
		this.generateMapping(this.cliffMapping, FILL_TYPE_CLIFF);
		this.generateMapping(this.cliffAltMapping, FILL_TYPE_CLIFF_ALT);
		
	}
	
	private generateMapping(map: Map<number, keyof FillType>, fillType: FillType) {
		for (const key of Object.keys(fillType) as (keyof FillType)[]) {
			const offsets = fillType[key];
			offsets.forEach(offset => map.set(this.getMappingKey(offset), key));
		}
	}
	
	getAutotileConfig(tilesetName: string, tile: number, checkCliffs = false): { config: AutotileConfig, isCliff: boolean } | null {
		const configs = AUTOTILE_CONFIG[tilesetName];
		if (!configs) {
			return null;
		}
		for (const config of configs) {
			const pos = Helper.indexToPoint(tile, config.tileCountX);
			if (this.getFill(pos, config.base, this.mapping)) {
				return {config: config, isCliff: false};
			}
			if (checkCliffs && this.getFill(pos, config.cliff, this.cliffBorderMapping)) {
				return {config: config, isCliff: true};
			}
		}
		
		return null;
	}
	
	getFillType(config: AutotileConfig, tile: number, cliff = false): keyof FillType | undefined {
		const pos = Helper.indexToPoint(tile, config.tileCountX);
		
		if (!cliff) {
			return this.getFill(pos, config.base, this.mapping);
		}
		const tilesetBase = CHIPSET_CONFIG[config.key].base;
		
		return this.getFill(pos, config.cliff, this.cliffBorderMapping)
			|| this.getFill(pos, tilesetBase.cliff, this.cliffMapping)
			|| this.getFill(pos, tilesetBase.cliffAlt, this.cliffAltMapping);
	}
	
	private getFill(pos: Point, offset: Point | undefined, mapping: Map<number, keyof FillType>) {
		if (!offset) {
			return undefined;
		}
		const p = Vec2.sub(pos, offset, true);
		return mapping.get(this.getMappingKey(p));
	}
	
	getGfx(fillType: keyof FillType, config: AutotileConfig) {
		const offsets = FILL_TYPE[config.type][fillType];
		const offset = offsets[Math.floor(Math.random() * offsets.length)];
		
		return this.getTile(config.base.x + offset.x, config.base.y + offset.y, config.tileCountX);
	}
	
	private getTile(x: number, y: number, tileCountX: number) {
		return y * tileCountX + x + 1;
	}
	
	private getMappingKey(p: Point) {
		return p.y * 2000 + p.x;
	}
	
}
