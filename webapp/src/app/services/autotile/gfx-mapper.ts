import { Point } from '../../models/cross-code-map';
import { ChipsetConfig } from '../height-map/gfx-mapper/gfx-mapper.constants';
import { Helper } from '../phaser/helper';
import { Vec2 } from '../phaser/vec2';
import { AutotileConfig, AutotileType, FILL_TYPE, FILL_TYPE_CLIFF, FILL_TYPE_CLIFF_ALT, FILL_TYPE_CLIFF_BORDER, FillType } from './autotile.constants';

import { JsonLoaderService } from '../json-loader.service';

interface JsonType {
	map: string;
	tileCountX: number;
	autotiles: {
		size: Point;
		cliff?: Point | null | false;
		mergeWithEmpty?: boolean;
		base: Point;
	}[];
}

export class GfxMapper {
	
	private AUTOTILE_CONFIG: {
		[key: string]: AutotileConfig[] | undefined;
	} = {};
	
	
	private TILESET_CONFIG: { [key: string]: ChipsetConfig } = {};
	
	private mapping: { [key in AutotileType]: Map<number, keyof FillType> } = <any>{};
	private cliffBorderMapping = new Map<number, keyof FillType>();
	private cliffMapping = new Map<number, keyof FillType>();
	private cliffAltMapping = new Map<number, keyof FillType>();
	
	constructor(
		private jsonLoader: JsonLoaderService
	) {
		this.init();
	}
	
	private async init() {
		this.TILESET_CONFIG = await this.jsonLoader.loadJsonMerged('tilesets.json');
		await this.generateAutotileConfig();
		
		for (const type of Helper.typedKeys(FILL_TYPE)) {
			const map = new Map<number, keyof FillType>();
			this.mapping[type] = map;
			this.generateMapping(map, FILL_TYPE[type]);
		}
		
		this.generateMapping(this.cliffBorderMapping, FILL_TYPE_CLIFF_BORDER);
		this.generateMapping(this.cliffMapping, FILL_TYPE_CLIFF);
		this.generateMapping(this.cliffAltMapping, FILL_TYPE_CLIFF_ALT);
	}
	
	private async generateAutotileConfig() {
		const jsons = await this.jsonLoader.loadJson<JsonType[]>('autotiles.json');
		const autotilesJson = jsons.flat();
		for (const config of autotilesJson) {
			let arr: AutotileConfig[] = [];
			const prevArr = this.AUTOTILE_CONFIG[config.map];
			if (prevArr) {
				arr = prevArr;
			}
			this.AUTOTILE_CONFIG[config.map] = arr;
			
			for (const autotile of config.autotiles) {
				const generatedType: AutotileType = `${autotile.size.x}x${autotile.size.y}` as AutotileType;
				
				const tileset = this.TILESET_CONFIG[config.map];
				const terrains = tileset.terrains ?? [];
				terrains.push(tileset.base);
				let cliff = autotile.cliff;
				if (cliff === undefined) {
					for (const terrain of terrains) {
						if (terrain.ground.x === autotile.base.x && terrain.ground.y === autotile.base.y) {
							cliff = terrain.cliff;
							break;
						}
					}
				}
				
				const newConfig: AutotileConfig = {
					key: config.map,
					tileCountX: config.tileCountX,
					type: generatedType,
					mergeWithEmpty: autotile.mergeWithEmpty === undefined ? true : autotile.mergeWithEmpty,
					base: autotile.base,
					cliff: cliff ? cliff : undefined
				};
				
				arr.push(newConfig);
			}
		}
	}
	
	private generateMapping(map: Map<number, keyof FillType>, fillType: FillType) {
		for (const key of Object.keys(fillType) as (keyof FillType)[]) {
			const offsets = fillType[key];
			offsets.forEach(offset => map.set(this.getMappingKey(offset), key));
		}
	}
	
	getAutotileConfig(tilesetName: string, tile: number, checkCliffs = false): { config: AutotileConfig, isCliff: boolean } | null {
		const configs = this.AUTOTILE_CONFIG[tilesetName];
		if (!configs) {
			return null;
		}
		for (const config of configs) {
			const pos = Helper.indexToPoint(tile, config.tileCountX);
			if (this.getFill(pos, config.base, this.mapping[config.type])) {
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
			return this.getFill(pos, config.base, this.mapping[config.type]);
		}
		const tilesetConfig = this.TILESET_CONFIG[config.key];
		let tilesetBase;
		if (tilesetConfig && tilesetConfig.base) {
			tilesetBase = tilesetConfig.base;
		}
		
		const fill = this.getFill(pos, config.cliff, this.cliffBorderMapping);
		
		if (fill) {
			return fill;
		} else if (tilesetBase) {
			return this.getFill(pos, tilesetBase.cliff, this.cliffMapping) || this.getFill(pos, tilesetBase.cliffAlt, this.cliffAltMapping);
		}
		
		
		return undefined;
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
		return p.y * 1000 + p.x;
	}
	
}
