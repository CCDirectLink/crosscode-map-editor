import {GFX_MAPS, GfxMap, GfxMaps} from './constants';
import {ChipsetBase, ChipsetConfig} from '../chipset-config';
import {GFX_TYPE} from '../constants';
import {Point} from '../../../models/cross-code-map';

interface ChipsetMapping extends ChipsetBase {
	mapping: GfxMaps;
}

export class GfxMapper {
	private tileCountX = 0;
	private base: ChipsetMapping;
	private terrains: ChipsetMapping[] = [];
	
	constructor(settings: ChipsetConfig) {
		this.tileCountX = settings['tileCountX'];
		this.base = this._copySettings(settings['base']);
		if (settings['terrains']) {
			for (let i = 0; i < settings['terrains'].length; ++i) {
				this.terrains[i] = this._copySettings(settings['terrains'][i]);
			}
		}
		
	}
	
	_copySettings(mappingSettings: ChipsetBase) {
		const result: ChipsetMapping = JSON.parse(JSON.stringify(mappingSettings));
		if (mappingSettings.mappingType) {
			result.mapping = GFX_MAPS[mappingSettings.mappingType];
		}
		return result;
	}
	
	_getMappingMain(terrain: number): ChipsetMapping {
		if (terrain && this.terrains[terrain - 1]) {
			const terrainEntry = this.terrains[terrain - 1];
			if (terrainEntry.mapping) {
				return terrainEntry;
			}
			if (terrainEntry.baseTerrain) {
				return this.terrains[terrainEntry.baseTerrain - 1];
			}
		}
		return this.base;
	}
	
	hasShadowSide(terrain: number) {
		const mapping = this._getMappingMain(terrain);
		return mapping.mapping.hasShadowSide;
	}
	
	getChasmHeight(terrain: number) {
		const mapping = this._getMappingMain(terrain);
		let minHeight = 1;
		if (mapping.mapping['CHASM'].wallYVariance) {
			minHeight = mapping.mapping['CHASM'].wallYVariance[GFX_TYPE.WALL_SOUTH].start.length;
		}
		return minHeight;
	}
	
	getChasmTileAdd(terrain: number) {
		const mapping = this._getMappingMain(terrain);
		return mapping.mapping.chasmTileAdd || 0;
	}
	
	hasFloorChasm(terrain: number) {
		return this.getChasmTileAdd(terrain) === 0;
	}
	
	hasShadow() {
		return this.base.shadow && !this.base.chasmOnly;
	}
	
	hasChasm() {
		return this.base.shadow;
	}
	
	isFill(gfxType: GFX_TYPE, terrain?: number) {
		return gfxType === GFX_TYPE.FILL ||
			(terrain && this.terrains[terrain - 1].blockedTypes ?
				this.terrains[terrain - 1].blockedTypes!.indexOf(gfxType) !== -1 :
				this.base.blockedTypes && this.base.blockedTypes.indexOf(gfxType) !== -1);
	}
	
	isWallTerrainFromTop(lower: number, upper: number) {
		const lowerTerrain = lower && this.terrains[lower - 1] || this.base;
		const upperTerrain = upper && this.terrains[upper - 1] || this.base;
		return (upperTerrain && upperTerrain.wallTerrainPrio || 0) > (lowerTerrain && lowerTerrain.wallTerrainPrio || 0);
	}
	
	getGfx(gfxType: GFX_TYPE, x: number, y: number, subType: keyof GfxMaps | null, terrain: number, terrainBorder: number = -1, wallProps?: { start: number, end: number }) {
		if (terrain && !this.terrains[terrain - 1]) {
			terrain = 0;
		}
		let mainMapping = this.base;
		let subMapping: ChipsetMapping | null = null;
		if (terrain && this.terrains[terrain - 1].mapping) {
			mainMapping = this.terrains[terrain - 1];
		} else if (terrain) {
			subMapping = this.terrains[terrain - 1];
			if (subMapping && subMapping.baseTerrain) {
				mainMapping = this.terrains[subMapping.baseTerrain - 1];
			}
		}
		
		
		let offset = null;
		const mapping = mainMapping.mapping;
		let tiles = mapping['BASE'][gfxType];
		let ground: Point | undefined = mainMapping.ground;
		let cliff: Point | undefined = mainMapping.cliff;
		let wallYVariance = mapping['BASE'].wallYVariance;
		const ignore = subMapping && subMapping.overrideWallBase ? mapping['SUB'].ignoreTerrainKeepWallBase : mapping['SUB'].ignoreTerrain;
		
		if (!ignore) {
			throw new Error('ignore should be defined');
		}
		
		if (subMapping && ignore.indexOf(gfxType) !== -1) {
			subMapping = null;
		}
		
		if (subType) {
			const gfxMap = mapping[subType] as GfxMap;
			offset = gfxMap.offset;
			tiles = gfxMap[gfxType] || tiles;
			wallYVariance = gfxMap.wallYVariance || wallYVariance;
			ground = undefined;
			cliff = mainMapping.shadow;
		} else if (mainMapping.cliffAlt && mapping['ALT'][gfxType] && Math.random() < 0.5) {
			offset = mapping['ALT'].offset;
			tiles = mapping['ALT'][gfxType];
		}
		
		let hasTerrainBorder = false;
		if (subMapping) {
			// @ts-ignore
			const subTypeSubMapping = subType && mapping['SUB'][subType];
			if (subTypeSubMapping && subTypeSubMapping[gfxType]) {
				cliff = subMapping.cliff;
				offset = subTypeSubMapping.offset;
				tiles = subTypeSubMapping[gfxType];
			} else if (!subType) {
				ground = subMapping.ground;
				cliff = subMapping.cliff;
				tiles = mapping['SUB']['BASE'][gfxType] || tiles;
				hasTerrainBorder = !!subMapping.border;
			}
		}
		
		const offX = offset && offset.x || 0;
		let offY = offset && offset.y || 0;
		
		if (this.isFill(gfxType)) {
			if (ground) {
				return this._getTile(ground.x, ground.y);
			}
			
			if (tiles) {
				if (!cliff) {
					throw new Error('cliff should be defined by now');
				}
				return this._getMappingTile(cliff, tiles, x, y, offY);
			}
			return 0;
		}
		
		if (wallProps && wallYVariance && wallYVariance[gfxType]) {
			const variance = wallYVariance[gfxType];
			if (variance.end && wallProps.end < variance.end.length) {
				offY += variance.end[wallProps.end];
			} else if (variance.start && wallProps.start < variance.start.length) {
				offY += variance.start[wallProps.start];
			} else if (variance.loop) {
				offY += variance.loop[wallProps.start % variance.loop.length];
			}
		}
		
		if (hasTerrainBorder && terrain && terrainBorder !== -1 && mapping['SUB']['BORDER'][gfxType]) {
			tiles = mapping['SUB']['BORDER'][gfxType][terrainBorder];
		}
		
		if (!tiles || tiles.length === 0) {
			return 0;
		}
		if (!cliff) {
			throw new Error('cliff should be defined by now (end)');
		}
		return this._getMappingTile(cliff, tiles, x, y, offY);
	}
	
	_getMappingTile(base: Point, mapping: number[][], x: number, y: number, deltaY?: number) {
		const variation = (mapping.length > 1 && this._getVariation(x, y));
		const coords = (variation ? mapping[1] : mapping[0]);
		return this._getTile(base.x + coords[0], base.y + coords[1] + (deltaY || 0));
	}
	
	_getTile(x: number, y: number) {
		return y * this.tileCountX + x + 1;
	}
	
	_getVariation(x: number, y: number) {
		return (x + y) % 2;
	}
	
}
