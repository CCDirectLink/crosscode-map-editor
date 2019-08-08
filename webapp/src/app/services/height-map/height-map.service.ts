import {Injectable} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {GlobalEventsService} from '../../shared/global-events.service';
import {Globals} from '../../shared/globals';
import {
	CHECK_DIR,
	CHECK_ITERATE,
	CheckDir,
	DIAG_GFX,
	FILL_COUNT,
	FILL_TYPE,
	GFX_TYPE,
	LEVEL_COUNT,
	SECOND_LEVEL_CHECK,
	SHADOW_CORNER_EXCEPTION,
	SQUARE_CORNER_CHECK,
	SUB_TYPE,
	WALL_LINK,
	WallLink
} from './constants';
import {CHIPSET_CONFIG} from './chipset-config';
import {CCMapLayer} from '../../shared/phaser/tilemap/cc-map-layer';
import {GfxMapper} from './gfx-mapper/gfx-mapper';
import {BACK_WALL_MAP, BLOCK_MAP, HOLE_BLOCK_MAP, HOLE_MAP} from './gfx-mapper/constants';
import {MapLoaderService} from '../../shared/map-loader.service';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {StateHistoryService} from '../../shared/history/state-history.service';
import {AutotileService} from '../autotile/autotile.service';

interface TileData {
	level: number;
	fill: FILL_TYPE;
	terrain: number;
	gfx: GFX_TYPE;
	lowerLevel: number;
	lowerTerrain: number;
	upperLevel: number;
	terrainBorder: number;
}

@Injectable({
	providedIn: SharedModule
})
export class HeightMapService {
	private data: (TileData | null)[][] = [];
	private lastData: (TileData | null)[][] = [];
	private minLevel = 0;
	private maxLevel = 0;
	private width = 0;
	private height = 0;
	
	private c_wallProps = {start: 0, end: 0};
	
	constructor(
		private events: GlobalEventsService,
		private mapLoader: MapLoaderService,
		private stateHistory: StateHistoryService,
		private autotile: AutotileService
	) {
	}
	
	public init() {
		this.events.generateHeights.subscribe(forceAll => this.generateHeights(forceAll));
		this.mapLoader.tileMap.subscribe(map => this.onMapLoad(map));
		
		// TODO: add shortcuts for generation
	}
	
	private onMapLoad(inputMap?: CCMap) {
		if (!inputMap) {
			return;
		}
		const heightmap = inputMap.layers.find(layer => layer.details.type === 'HeightMap');
		if (!heightmap) {
			console.warn(`current map [${inputMap.name}] has no height map`);
			return;
		}
		this.storeTileData(heightmap.exportLayer().data);
		this.convertRoundTiles();
		this.setGfxType();
		this.lastData = this.data;
		this.data = [];
	}
	
	generateHeights(forceAll: boolean) {
		const map = Globals.map;
		const heightmap = map.layers.find(layer => layer.details.type === 'HeightMap');
		if (!heightmap) {
			console.warn(`cannot generate heights, current map [${map.name}] has no height map`);
			return;
		}
		this.storeTileData(heightmap.exportLayer().data);
		this.convertRoundTiles();
		this.setGfxType();
		this.applyOnLayers(forceAll);
		this.lastData = this.data;
		
		this.stateHistory.saveState({
			name: 'Height Generation',
			icon: 'landscape'
		});
	}
	
	private storeTileData(tiles: number[][]) {
		this.data = [];
		const width = tiles[0].length, height = tiles.length;
		this.minLevel = 1000;
		this.maxLevel = 0;
		this.width = width;
		this.height = height;
		for (let y = 0; y < height; ++y) {
			this.data[y] = [];
			for (let x = 0; x < width; ++x) {
				let tile = tiles[y][x] - 1;
				if (tile === -1) {
					this.data[y][x] = null;
					continue;
				}
				const terrain = Math.floor(tile / (FILL_COUNT * LEVEL_COUNT));
				tile = tile % (FILL_COUNT * LEVEL_COUNT);
				
				const entry = {
					level: Math.floor(tile / 8) || -1,
					fill: (tile % 8),
					terrain: terrain,
					gfx: GFX_TYPE.FILL,
					lowerLevel: 0,
					lowerTerrain: 0,
					upperLevel: 0,
					terrainBorder: -1
				};
				this.minLevel = Math.min(entry.level, this.minLevel);
				this.maxLevel = Math.max(entry.level, this.maxLevel);
				this.data[y][x] = entry;
			}
		}
	}
	
	private convertRoundTiles() {
		for (let level = this.maxLevel; level >= this.minLevel; level--) {
			for (let y = 0; y < this.height; ++y) {
				for (let x = 0; x < this.width; ++x) {
					const entry = this.data[y][x];
					if (!entry) {
						continue;
					}
					if (entry.level !== level) {
						continue;
					}
					if (entry.fill !== FILL_TYPE.ROUND) {
						continue;
					}
					entry.fill = this.getRoundTileReplace(x, y, entry.level);
				}
			}
		}
	}
	
	private setGfxType() {
		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				const entry = this.data[y][x];
				if (!entry) {
					continue;
				}
				if (entry.fill === FILL_TYPE.SQUARE) {
					this.setSquareGfx(x, y, entry);
				} else {
					this.setDiagonalGfx(x, y, entry);
				}
			}
		}
	}
	
	private applyOnLayers(forceAll: boolean) {
		const layers = Globals.map.layers;
		const len = layers.length;
		let lastLevel = -1;
		for (let i = 0; i < len; ++i) {
			const layer = layers[i];
			// TODO: use level strings, levelName is currently set on load and then ignored in the editor
			const details = layer.details;
			if (details.levelName === 'first' || details.levelName === 'last' || (details.levelName && details.levelName.indexOf('object') !== -1)) {
				continue;
			}
			if (details.distance !== 1) {
				continue;
			}
			if (details.type === 'Background' && CHIPSET_CONFIG[details.tilesetName] && lastLevel !== details.level) {
				lastLevel = details.level;
				this.applyOnBackground(layer, forceAll);
			} else if (details.type === 'Collision') {
				this.applyOnCollision(layer, forceAll);
			}
		}
	}
	
	private getLevelHeight(levelIdx: number, layer: CCMapLayer) {
		if (levelIdx < 1) {
			levelIdx = 1;
		}
		const levels = Globals.map.levels;
		const level = levels[levelIdx - 1];
		if (level) {
			return level.height / Globals.TILE_SIZE;
		}
		const maxLevel = levels[levels.length - 1];
		return (maxLevel.height / Globals.TILE_SIZE) + (levelIdx - levels.length) * 2;
	}
	
	private getLevelDistance(levelStart: number, levelEnd: number, layer: CCMapLayer) {
		return this.getLevelHeight(levelEnd, layer) - this.getLevelHeight(levelStart, layer);
	}
	
	private applyOnBackground(layer: CCMapLayer, forceAll: boolean) {
		const config = CHIPSET_CONFIG[layer.details.tilesetName];
		if (!config) {
			return;
		}
		const gfxMapper = new GfxMapper(config);
		
		const details = layer.details;
		
		const levels = Globals.map.levels;
		const currentLevel = levels[details.level];
		const nextLevel = levels[details.level * 1 + 1];
		const masterLevel = levels[Globals.map.masterLevel];
		const maxLevel = levels.length;
		const yOff = (currentLevel.height - masterLevel.height) / Globals.TILE_SIZE;
		const yHeight = nextLevel ? (nextLevel.height - currentLevel.height) / Globals.TILE_SIZE : 0;
		const levelIdx: number = details.level + 1;
		const masterLevelIdx = Globals.map.masterLevel + 1;
		
		const c_wallProps = this.c_wallProps;
		
		if (typeof details.level === 'string' || typeof Globals.map.masterLevel === 'string') {
			throw new Error('some level is a string:\nlevel: ' + details.level + '\nmasterLevel: ' + Globals.map.masterLevel);
		}
		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				const entry = this.data[y][x];
				if (!entry) {
					continue;
				}
				const doShadow = (gfxMapper.hasShadow() && (entry.level > maxLevel && entry.lowerLevel <= maxLevel));
				
				let wallLink: WallLink | null = WALL_LINK[entry.gfx];
				if (wallLink && wallLink.shadowOnly && (!doShadow || levelIdx < masterLevelIdx)) {
					wallLink = null;
				}
				
				if (entry.level === levelIdx) {
					if (!forceAll && !this.hasTileAreaChanged(x, y)) {
						continue;
					}
					
					let subType: SUB_TYPE | null = null;
					if (gfxMapper.hasFloorChasm(entry.terrain)
						&& (entry.gfx === GFX_TYPE.DIAGONAL_SE || entry.gfx === GFX_TYPE.DIAGONAL_SW)
						&& entry.level === masterLevelIdx && entry.lowerLevel === -1) {
						subType = SUB_TYPE.CHASM_FLOOR;
					}
					const newTile = gfxMapper.getGfx(entry.gfx, x, y - yOff, subType, entry.terrain, entry.terrainBorder);
					this.setLayerTile(layer, x, y - yOff, newTile);
				} else if (wallLink && wallLink.toMaster && masterLevelIdx <= levelIdx && levelIdx < entry.lowerLevel) {
					const actualYHeight = yHeight;
					const deltaY = wallLink.deltaY || 0;
					if (!forceAll && !this.hasTileLineChanged(x, y, actualYHeight)) {
						continue;
					}
					c_wallProps.start = this.getLevelDistance(masterLevelIdx, levelIdx, layer);
					c_wallProps.end = this.getLevelDistance(levelIdx, entry.lowerLevel, layer) - 1;
					for (let yAdd = 0; yAdd < actualYHeight; ++yAdd) {
						const gfxType = yAdd === 0 && masterLevelIdx === levelIdx ? wallLink.base : wallLink.wall;
						const newTile = gfxMapper.getGfx(gfxType, x, y - yOff - yAdd + deltaY, SUB_TYPE.BACK_WALL, entry.lowerTerrain, -1, c_wallProps);
						this.setLayerTile(layer, x, y - yOff - yAdd + deltaY, newTile);
						c_wallProps.start++;
						c_wallProps.end--;
					}
					if (deltaY) {
						const newTile = gfxMapper.getGfx(GFX_TYPE.FILL, x, y - yOff, SUB_TYPE.SHADOW, entry.lowerTerrain);
						this.setLayerTile(layer, x, y - yOff, newTile);
					}
					
				} else if (wallLink
					&& !wallLink.toMaster
					&& (entry.lowerLevel <= levelIdx || (doShadow && levelIdx === masterLevelIdx))
					&& entry.level > levelIdx) {
					
					const doChasm = (!wallLink.shadowOnly && gfxMapper.hasChasm() && entry.lowerLevel === -1 && levelIdx < masterLevelIdx);
					let actualYHeight = yHeight;
					let yStart = 0;
					let doShadowWall = false;
					const chasmHeight = gfxMapper.getChasmHeight(entry.terrain);
					const chasmPadding = gfxMapper.getChasmTileAdd(entry.terrain);
					
					if (doChasm) {
						yStart = this.getLevelDistance(levelIdx, masterLevelIdx, layer) - chasmHeight - chasmPadding;
					} else if (doShadow && levelIdx === masterLevelIdx) {
						actualYHeight = this.getLevelDistance(levelIdx, entry.level, layer);
						doShadowWall = true;
						yStart = this.getLevelDistance(levelIdx, entry.lowerLevel, layer);
					}
					
					if (!forceAll && !this.hasTileLineChanged(x, y, actualYHeight)) {
						continue;
					}
					
					const terrain = entry.lowerLevel === -1 || gfxMapper.isWallTerrainFromTop(entry.lowerTerrain, entry.terrain) ? entry.terrain : entry.lowerTerrain;
					
					if (doShadow && levelIdx > masterLevelIdx) {
						const newTile = gfxMapper.getGfx(GFX_TYPE.INVISIBLE_WALL, x, y - yOff, SUB_TYPE.SHADOW, terrain);
						this.setLayerTile(layer, x, y - yOff, newTile);
						continue;
					}
					
					c_wallProps.start = this.getLevelDistance(entry.lowerLevel, levelIdx, layer);
					c_wallProps.end = this.getLevelDistance(levelIdx, entry.level, layer) - 1 - yStart;
					if (doChasm) {
						c_wallProps.start = Math.max(-yStart, 0);
					}
					if (yStart && doShadowWall) {
						c_wallProps.start = 0;
					}
					
					for (let yAdd = 0; yAdd < actualYHeight; ++yAdd) {
						
						let gfxType: GFX_TYPE | undefined;
						let subType: SUB_TYPE | null = null;
						if (yAdd < yStart) {
							let newTile = 0;
							if (doShadow) {
								newTile = gfxMapper.getGfx(GFX_TYPE.FILL, x, y - yOff, SUB_TYPE.SHADOW, entry.lowerTerrain);
							}
							this.setLayerTile(layer, x, y - yOff - yAdd, newTile);
							continue;
						}
						if (yAdd === 0 && entry.lowerLevel === levelIdx) {
							gfxType = wallLink.base;
						} else if (doShadowWall && yAdd === yStart) {
							gfxType = wallLink.base;
						} else if (yAdd === 0 && gfxMapper.hasFloorChasm(terrain) && entry.lowerLevel === -1 && levelIdx === masterLevelIdx) {
							gfxType = wallLink.base;
							if (entry.gfx === GFX_TYPE.DIAGONAL_SE || entry.gfx === GFX_TYPE.DIAGONAL_SW) {
								subType = SUB_TYPE.CHASM;
							}
						} else {
							gfxType = wallLink.wall;
							if (doShadowWall && ((actualYHeight - yAdd) === 1)) {
								subType = SUB_TYPE.SHADOW;
							}
						}
						if (wallLink.shadowOnly) {
							subType = SUB_TYPE.SHADOW;
						}
						if (doChasm && yAdd - yStart < chasmHeight) {
							if (gfxMapper.hasFloorChasm(terrain) && entry.level === masterLevelIdx) {
								subType = SUB_TYPE.CHASM_FLOOR;
							} else {
								subType = SUB_TYPE.CHASM;
							}
						}
						if (gfxType) {
							const newTile = gfxMapper.getGfx(gfxType, x, y - yOff - yAdd, subType, terrain, -1, c_wallProps);
							this.setLayerTile(layer, x, y - yOff - yAdd, newTile);
						}
						c_wallProps.start++;
						c_wallProps.end--;
					}
					if (wallLink.wall && doShadowWall) {
						const newTile = gfxMapper.getGfx(entry.gfx, x, y - yOff - actualYHeight, SUB_TYPE.SHADOW, terrain);
						this.setLayerTile(layer, x, y - yOff - actualYHeight, newTile);
					}
				} else if (entry.lowerLevel === levelIdx) {
					if (!forceAll && !this.hasTileChanged(x, y)) {
						continue;
					}
					let newTile;
					if (gfxMapper.hasShadow()) {
						if (details.level > Globals.map.masterLevel) {
							if (BACK_WALL_MAP[entry.gfx]) {
								newTile = gfxMapper.getGfx(BACK_WALL_MAP[entry.gfx], x, y - yOff, SUB_TYPE.BACK_WALL, entry.lowerTerrain);
							} else {
								newTile = gfxMapper.getGfx(GFX_TYPE.INVISIBLE_WALL, x, y - yOff, SUB_TYPE.SHADOW, entry.lowerTerrain);
							}
						} else {
							newTile = gfxMapper.getGfx(entry.gfx, x, y - yOff, SUB_TYPE.SHADOW, entry.lowerTerrain);
							if (!gfxMapper.hasShadowSide(entry.lowerTerrain) && SHADOW_CORNER_EXCEPTION[entry.gfx]) {
								const upperEntry = this.data[y - 1] && this.data[y - 1][x];
								if (upperEntry && SHADOW_CORNER_EXCEPTION[entry.gfx].test === upperEntry.gfx) {
									newTile = gfxMapper.getGfx(SHADOW_CORNER_EXCEPTION[entry.gfx].set, x, y - yOff, SUB_TYPE.SHADOW, entry.lowerTerrain);
								}
							}
						}
					} else {
						newTile = gfxMapper.getGfx(GFX_TYPE.FILL, x, y - yOff, null, entry.lowerTerrain);
					}
					this.setLayerTile(layer, x, y - yOff, newTile);
				} else {
					if (!forceAll && !this.hasTileLineShadowChanged(x, y, layer)) {
						continue;
					}
					let newTile = 0;
					if (gfxMapper.hasShadow() && details.level === Globals.map.masterLevel && entry.level > levelIdx) {
						
						if (doShadow && entry.lowerLevel && entry.lowerLevel < masterLevelIdx) {
							newTile = gfxMapper.getGfx(entry.gfx, x, y - yOff, SUB_TYPE.DARK_WALL, entry.lowerTerrain);
						} else {
							newTile = gfxMapper.getGfx(GFX_TYPE.FILL, x, y - yOff, SUB_TYPE.SHADOW, entry.lowerTerrain);
						}
					}
					this.setLayerTile(layer, x, y - yOff, newTile);
				}
			}
		}
	}
	
	private applyOnCollision(layer: CCMapLayer, forceAll: boolean) {
		const details = layer.details;
		const levels = Globals.map.levels;
		const currentLevel = levels[details.level];
		const masterLevel = levels[Globals.map.masterLevel];
		const yOff = (currentLevel.height - masterLevel.height) / Globals.TILE_SIZE;
		const levelIdx = details.level * 1 + 1;
		const belowMaster = (details.level <= Globals.map.masterLevel);
		const smallerMaster = (details.level < Globals.map.masterLevel);
		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {
				if (!forceAll && !this.hasTileChanged(x, y)) {
					continue;
				}
				const entry = this.data[y][x];
				if (!entry) {
					continue;
				}
				let newTile = 0;
				if (entry.level < levelIdx) {
					newTile = (belowMaster ? HOLE_MAP[FILL_TYPE.SQUARE] : 0);
				} else if (entry.fill === FILL_TYPE.SQUARE) {
					if (!smallerMaster && entry.level > levelIdx) {
						newTile = BLOCK_MAP[entry.fill];
					}
				} else {
					if (!smallerMaster && entry.lowerLevel > levelIdx) {
						newTile = BLOCK_MAP[FILL_TYPE.SQUARE];
					} else if (entry.level > levelIdx) {
						if (entry.lowerLevel < levelIdx && belowMaster) {
							newTile = (smallerMaster ? HOLE_MAP[entry.fill] : HOLE_BLOCK_MAP[entry.fill]);
						} else if (!smallerMaster) {
							newTile = BLOCK_MAP[entry.fill];
						}
					} else if (entry.level === levelIdx && belowMaster) {
						newTile = HOLE_MAP[entry.fill];
					}
				}
				this.setLayerTile(layer, x, y - yOff, newTile);
			}
		}
	}
	
	private hasTileAreaChanged(x: number, y: number) {
		if (this.hasTileChanged(x, y)) {
			return true;
		}
		let i = CHECK_ITERATE.length;
		while (i--) {
			const check = CHECK_DIR[CHECK_ITERATE[i]];
			if (this.hasTileChanged(x + check.dx, y + check.dy)) {
				return true;
			}
		}
		return false;
	}
	
	private hasTileLineChanged(x: number, y: number, yAdd: number) {
		let i = yAdd + 1;
		while (i--) {
			if (this.hasTileChanged(x, y - i)) {
				return true;
			}
		}
		return false;
	}
	
	private hasTileLineShadowChanged(x: number, y: number, layer: CCMapLayer) {
		const ySub = 10;
		let i = ySub + 1;
		const levels = Globals.map.levels;
		while (i--) {
			if (this.hasTileChanged(x, y + i)) {
				if (!i) {
					return true;
				}
				const entry = this.data[y + i][x];
				if (!entry) {
					throw new Error('entry should be defined. x: ' + x + ' y: ' + (y + 1));
				}
				if (entry.level > levels.length) {
					let height = this.getLevelDistance(Globals.map.masterLevel + 1, levels.length, layer);
					const delta = entry.level - levels.length;
					height += delta * 2;
					if (i <= height) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	private hasTileChanged(x: number, y: number) {
		if (!this.lastData) {
			return true;
		}
		const lastEntry = this.lastData[y] && this.lastData[y][x];
		const newEntry = this.data[y] && this.data[y][x];
		if (!lastEntry && !newEntry) {
			return false;
		}
		if (!lastEntry || !newEntry) {
			return true;
		}
		return lastEntry.level !== newEntry.level || lastEntry.fill !== newEntry.fill
			|| lastEntry.gfx !== newEntry.gfx || lastEntry.lowerLevel !== newEntry.lowerLevel
			|| lastEntry.terrain !== newEntry.terrain || lastEntry.lowerTerrain !== newEntry.lowerTerrain
			|| lastEntry.terrainBorder !== newEntry.terrainBorder;
	}
	
	private setLayerTile(layer: CCMapLayer, x: number, y: number, tileValue: number) {
		if (y < 0 || y >= this.height) {
			return;
		}
		const phaserLayer = layer.getPhaserLayer();
		if (!phaserLayer) {
			throw new Error('phaser layer should be defined here');
		}
		const oldValue = phaserLayer.getTileAt(x, y).index;
		if (oldValue !== tileValue) {
			phaserLayer.putTileAt(tileValue, x, y, false);
		}
		
		this.autotile.drawTile(layer, x, y, tileValue);
	}
	
	private getRoundTileReplace(x: number, y: number, level: number) {
		const n = this.getOtherLevel(x, y, level, CHECK_DIR.NORTH),
			e = this.getOtherLevel(x, y, level, CHECK_DIR.EAST),
			w = this.getOtherLevel(x, y, level, CHECK_DIR.WEST),
			s = this.getOtherLevel(x, y, level, CHECK_DIR.SOUTH);
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
	
	private setSquareGfx(x: number, y: number, entry: TileData) {
		const level = entry.level;
		entry.gfx = <any>null;
		for (let i = 0; i < SQUARE_CORNER_CHECK.length; ++i) {
			const sqrCheck = SQUARE_CORNER_CHECK[i];
			const check1 = CHECK_DIR[sqrCheck.dir1], check2 = CHECK_DIR[sqrCheck.dir2];
			const otherLevel1 = this.getOtherLevel(x, y, level, check1);
			const otherLevel2 = this.getOtherLevel(x, y, level, check2);
			if (otherLevel1 && otherLevel2 && otherLevel1 < level && otherLevel2 < level) {
				entry.lowerLevel = otherLevel1;
				entry.lowerTerrain = this.getTerrain(x, y, check1) || 0;
				entry.gfx = sqrCheck.gfx;
				entry.terrainBorder = -1;
				return;
			}
		}
		
		for (let i = 0; i < CHECK_ITERATE.length; ++i) {
			const check = CHECK_DIR[CHECK_ITERATE[i]];
			const otherLevel = this.getOtherLevel(x, y, level, check);
			if (otherLevel && otherLevel < level) {
				entry.lowerLevel = otherLevel;
				entry.lowerTerrain = this.getTerrain(x, y, check) || 0;
				entry.gfx = check.gfx;
				entry.terrainBorder = this.getTerrainBorder(x, y, check, entry.terrain, level);
				return;
			}
		}
		if (!entry.gfx) {
			entry.gfx = GFX_TYPE.FILL;
		}
	}
	
	private setDiagonalGfx(x: number, y: number, entry: TileData) {
		const checks = SECOND_LEVEL_CHECK[entry.fill];
		let i = checks.length;
		
		const nLevels = [], nTerrains = [];
		while (i--) {
			nLevels[i] = this.getOtherLevel(x, y, entry.level, checks[i]);
			nTerrains[i] = this.getTerrain(x, y, checks[i]) || 0;
		}
		let lowerLevel, lowerTerrain;
		if (nLevels[0] !== nLevels[2]) {
			if (nLevels[0]) {
				lowerLevel = nLevels[0];
				lowerTerrain = nTerrains[0];
			} else if (nLevels[1]) {
				lowerLevel = nLevels[1];
				lowerTerrain = nTerrains[1];
			} else {
				lowerLevel = nLevels[2];
				lowerTerrain = nTerrains[2];
			}
		} else {
			if (nLevels[1]) {
				lowerLevel = nLevels[1];
				lowerTerrain = nTerrains[1];
			} else if (nLevels[0]) {
				lowerLevel = nLevels[0];
				lowerTerrain = nTerrains[0];
			} else {
				lowerLevel = nLevels[2];
				lowerTerrain = nTerrains[2];
			}
		}
		if (lowerLevel > entry.level) {
			entry.fill = entry.fill > 3 ? entry.fill - 2 : entry.fill + 2;
			entry.lowerLevel = entry.level;
			entry.lowerTerrain = entry.terrain;
			entry.level = lowerLevel;
			entry.terrain = lowerTerrain;
		} else {
			entry.lowerLevel = lowerLevel;
			entry.lowerTerrain = lowerTerrain;
		}
		entry.gfx = DIAG_GFX[entry.fill];
	}
	
	private getOtherLevel(x: number, y: number, level: number, dir: CheckDir) {
		y += dir.dy;
		x += dir.dx;
		const entry = this.data[y] && this.data[y][x];
		
		if (!entry) {
			return 0;
		}
		
		const isBlockType = (entry.fill === dir.blockType1 || entry.fill === dir.blockType2);
		
		if (entry.level === level) {
			return isBlockType ? entry.level : 0;
		} else {
			return !isBlockType ? entry.level : 0;
		}
	}
	
	private getTerrain(x: number, y: number, dir: CheckDir) {
		y += dir.dy;
		x += dir.dx;
		const entry = this.data[y] && this.data[y][x];
		if (!entry) {
			return false;
		}
		return entry.terrain;
	}
	
	private getOtherTerrain(x: number, y: number, dir: { dx: number, dy: number }, level: number) {
		y += dir.dy;
		x += dir.dx;
		const entry = this.data[y] && this.data[y][x];
		if (!entry) {
			return false;
		}
		if (entry.level !== level) {
			return false;
		}
		return entry.terrain;
	}
	
	private getTerrainBorder(x: number, y: number, dir: CheckDir, terrain: number, level: number) {
		if (!terrain) {
			return -1;
		}
		if (!dir.terrainBorder) {
			return -1;
		}
		let i = dir.terrainBorder.length;
		while (i--) {
			const check = dir.terrainBorder[i];
			const otherTerrain = this.getOtherTerrain(x, y, check, level);
			if (otherTerrain === false) {
				continue;
			}
			if (otherTerrain < terrain) {
				return i;
			}
		}
		return -1;
	}
	
}
