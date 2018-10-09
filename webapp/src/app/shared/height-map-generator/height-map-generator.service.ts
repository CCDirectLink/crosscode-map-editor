import {Injectable} from '@angular/core';
import {SharedModule} from '../shared.module';
import {GlobalEventsService} from '../global-events.service';
import {Globals} from '../globals';
import {CCMapLayer} from '../phaser/tilemap/cc-map-layer';
import {Point} from '../interfaces/cross-code-map';
import {CCMap} from '../phaser/tilemap/cc-map';
import {Vec2} from '../phaser/vec2';
import {Helper} from '../phaser/helper';

interface Dir {
	n: number;
	ne: number;
	e: number;
	se: number;
	s: number;
	sw: number;
	w: number;
	nw: number;
}

interface TilesetConfig {
	tileCountX: number;
	base: {
		mappingType: string,
		ground: Point,
		cliff: Point,
		cliffAlt?: Point,
		blockedTypes: string[],
	};
	terrains?: {
		ground: Point,
		cliff: Point,
		border: boolean,
	}[];
}

@Injectable({
	providedIn: SharedModule
})
export class HeightMapGeneratorService {
	
	// height map tiles
	private level0Id = 9;
	private levelOffset = 8;
	private typeOffset = 128;
	
	// collision tiles
	private CollTiles = {
		hole: 1,
		block_hole_offset: 16,
		block: 2,
		hole_sw: 4,
		hole_nw: 5,
		hole_ne: 6,
		hole_se: 7,
		block_sw: 8,
		block_nw: 9,
		block_ne: 10,
		block_se: 11,
	};
	
	// background tiles
	private bgTiles = {
		BORDER_NW: [{x: 1, y: 0}, {x: 0, y: 1}],
		BORDER_N: [{x: 2, y: 0}, {x: 3, y: 0}],
		BORDER_NE: [{x: 4, y: 0}, {x: 5, y: 1}],
		BORDER_E: [{x: 3, y: 1}, {x: 3, y: 2}],
		BORDER_SE: [{x: 4, y: 3}, {x: 5, y: 2}],
		BORDER_S: [{x: 2, y: 3}, {x: 3, y: 3}],
		BORDER_SW: [{x: 0, y: 2}, {x: 1, y: 3}],
		BORDER_W: [{x: 2, y: 1}, {x: 2, y: 2}],
		
		CORNER_NW: {x: 1, y: 1},
		CORNER_NE: {x: 4, y: 1},
		CORNER_SE: {x: 4, y: 2},
		CORNER_SW: {x: 1, y: 2},
	};
	
	private tilesetConfig: { [s: string]: TilesetConfig } = {};
	
	constructor(private events: GlobalEventsService) {
		this.tilesetConfig['media/map/autumn-outside.png'] = {
			tileCountX: 32,
			base: {
				mappingType: 'TYPE1',
				ground: {x: 0, y: 0},
				cliff: {x: 0, y: 5},
				blockedTypes: ['CORNER_SW', 'CORNER_SE']
			},
			terrains: [{
				ground: {x: 0, y: 1},
				cliff: {x: 0, y: 5},
				border: true
			}]
		};
		this.tilesetConfig['media/map/bergen-trail.png'] = {
			tileCountX: 32,
			base: {
				mappingType: 'TYPE1',
				ground: {x: 0, y: 0},
				cliff: {x: 0, y: 4},
				cliffAlt: {x: 0, y: 10},
				blockedTypes: []
			},
			terrains: [{
				ground: {x: 1, y: 0},
				cliff: {x: 6, y: 4},
				border: true
			}, {
				ground: {x: 1, y: 2},
				cliff: {x: 12, y: 4},
				border: true
			}, {
				ground: {x: 12, y: 12},
				cliff: {x: 12, y: 8},
				border: true
			}]
		};
	}
	
	public init(game: Phaser.Game) {
		this.events.generateHeights.subscribe(() => this.generateHeights());
		const generateKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		generateKey.onDown.add(() => this.generateHeights());
	}
	
	private generateHeights() {
		const game = Globals.game;
		const map = Globals.map;
		
		const extraSpace = 7;
		const topOffset = 1;
		
		map.resize(map.mapWidth, map.mapHeight + extraSpace, true);
		map.offsetMap({x: 0, y: extraSpace}, true, true);
		map.offsetMap({x: 0, y: -(extraSpace - topOffset)}, true, true);
		
		const masterLevel = map.masterLevel;
		const heightmap = map.layers.find(layer => layer.details.type === 'HeightMap');
		
		for (let i = 0; i < map.levels.length; i++) {
			const collision = map.layers.find(layer => layer.details.level === i && layer.details.type === 'Collision');
			const background = map.layers.find(layer => layer.details.level === i && layer.details.type === 'Background');
			
			if (collision) {
				collision.clear();
			}
			if (background) {
				background.clear();
			}
		}
		
		for (let i = masterLevel; i < map.levels.length; i++) {
			const collision = map.layers.find(layer => layer.details.level === i && layer.details.type === 'Collision');
			const background = map.layers.find(layer => layer.details.level === i && layer.details.type === 'Background');
			if (!collision) {
				console.warn(`collision for level ${i} not found`);
				continue;
			}
			if (i === masterLevel && masterLevel > 0) {
				const waterBg = map.layers.find(layer => layer.details.level === i - 1 && layer.details.type === 'Background');
				this.generateLayer(collision, waterBg, heightmap, i - 1, map, map.levels[i - 1].height - map.levels[masterLevel].height);
			}
			this.generateLayer(collision, background, heightmap, i, map, map.levels[i].height - map.levels[masterLevel].height);
		}
		console.log('WHYYYYYYYYYY');
		map.offsetMap({x: 0, y: -topOffset}, false, true);
		map.resize(map.mapWidth, map.mapHeight - extraSpace, true);
		
		map.renderAll();
	}
	
	generateLayer(collisions: CCMapLayer, background: CCMapLayer, heightmap: CCMapLayer, level: number, map: CCMap, height: number) {
		const data = heightmap.details.data;
		const minId = this.level0Id + this.levelOffset * (level + 1);
		const yOffset = Math.max(0, Math.floor(height / 16));
		const masterLevel = map.masterLevel;
		
		for (let y = 0; y < data.length; y++) {
			for (let x = 0; x < data[y].length; x++) {
				const tile = data[y][x] % this.typeOffset;
				if (tile < minId && level >= masterLevel) {
					continue;
				}
				this.generateCollision(collisions, heightmap, x, y, level, masterLevel, tile, minId, yOffset);
			}
		}
		
		const backgroundTop = map.layers.find(layer => layer.details.level === background.details.level + 1 && layer.details.type === 'Background');
		
		if (!backgroundTop) {
			return;
		}
		const tilesetConfig = this.tilesetConfig[background.details.tilesetName];
		for (let y = 0; y < data.length; y++) {
			for (let x = 0; x < data[y].length; x++) {
				const tile = data[y][x] % this.typeOffset;
				this.generateBackground(background, backgroundTop, collisions, x, y, level, data[y][x], minId, map, tilesetConfig, heightmap);
			}
		}
	}
	
	private generateCollision(collisions: CCMapLayer,
	                          heightmap: CCMapLayer,
	                          x: number,
	                          y: number,
	                          level: number,
	                          masterLevel: number,
	                          tile: number,
	                          minId: number,
	                          yOffset: number) {
		const other = this.getNeighbours(x, y, heightmap, tile, true);
		
		// TODO: add static tiles (tile % this.levelOffset !== 0 should be static tiles)
		
		let tileId = this.CollTiles.block;
		if (this.dirCompare(other, minId, 'n ne e', 'n ne e se', 'nw n ne e', 'nw n ne e se')) {
			tileId = this.CollTiles.block_ne;
		} else if (this.dirCompare(other, minId, 'w nw n', 'w nw n ne', 'sw w nw n', 'sw w nw n ne')) {
			tileId = this.CollTiles.block_nw;
		} else if (this.dirCompare(other, minId, 's sw w nw', 'se s sw w', 's sw w', 'se s sw w nw', 'sw w')) {
			tileId = this.CollTiles.block_sw;
		} else if (this.dirCompare(other, minId, 'sw s se e', 's se e', 'ne e se s', 'ne e se s sw')) {
			tileId = this.CollTiles.block_se;
		}
		
		if (tileId !== this.CollTiles.block && level === masterLevel) {
			'n e s w'.split(' ').some(key => {
				const id = other[key] % this.typeOffset;
				if (id === this.level0Id) {
					tileId += this.CollTiles.block_hole_offset;
					return true;
				}
			});
		}
		
		// water coll
		// TODO: is kinda broken. below master level should use maxId instead of minId for dirCompare because collisions are inversed
		if (level < masterLevel) {
			const def = this.CollTiles;
			if (tile < this.level0Id + this.levelOffset) {
				tileId = def.hole;
			} else {
				switch (tileId) {
					case def.block:
						return;
					case def.block_se:
						tileId = def.hole_nw;
						break;
					case def.block_sw:
						tileId = def.hole_ne;
						break;
					case def.block_nw:
						tileId = def.hole_se;
						break;
					case def.block_ne:
						tileId = def.hole_sw;
						break;
				}
			}
		}
		collisions.details.data[Math.max(0, y - yOffset)][x] = tileId;
	}
	
	private generateBackground(
		background: CCMapLayer,
		backgroundTop: CCMapLayer,
		collisions: CCMapLayer,
		x: number,
		y: number,
		level: number,
		heightmapTile: number,
		minId: number,
		map: CCMap,
		tilesetconfig: TilesetConfig,
		heightmap: CCMapLayer) {
		
		let yHeight = map.levels[level + 1].height - map.levels[level].height;
		yHeight /= Globals.TILE_SIZE;
		let yOffset = map.levels[level].height - map.levels[map.masterLevel].height;
		yOffset /= Globals.TILE_SIZE;
		
		let collTile = collisions.details.data[y][x];
		let other = this.getNeighbours(x, y, collisions, collTile);
		if (level < map.masterLevel) {
			collTile = this.getTile(x, y + yOffset, collisions, 0);
			if (y + yOffset >= collisions.details.height || y + yOffset < 0) {
				return;
			}
			other = this.getNeighbours(x, y + yOffset, collisions, collTile);
			collTile = this.holeToBlock(collTile);
			Object.keys(other).forEach(key => other[key] = this.holeToBlock(other[key]));
		}
		if (collTile === 0) {
			return;
		}
		
		
		// bottom
		if (this.isHole(other.s)) {
			let bgTile;
			const def = this.CollTiles;
			if (collTile === def.block) {
				bgTile = this.bgTiles.BORDER_S;
			} else if (collTile === def.block_nw || collTile === def.block_nw + def.block_hole_offset) {
				bgTile = this.bgTiles.BORDER_SE;
			} else if (collTile === def.block_ne || collTile === def.block_ne + def.block_hole_offset) {
				bgTile = this.bgTiles.BORDER_SW;
			} else {
				return;
			}
			
			// draw tiles (middle, top, bottom)
			for (let i = 0; i < yHeight; i++) {
				this.updateTile(x, y - i, bgTile, 1, background, tilesetconfig, true);
			}
			this.updateTile(x, y - yHeight, bgTile, 0, backgroundTop, tilesetconfig);
			
			const currentHeight = this.level0Id + this.levelOffset * level;
			let bottomHeightmapTile = currentHeight;
			const offsetY = y + 1 + yOffset;
			if (offsetY >= 0 && offsetY < heightmap.details.height) {
				bottomHeightmapTile = heightmap.details.data[offsetY][x] % this.typeOffset;
			}
			if (currentHeight - bottomHeightmapTile < this.levelOffset) {
				this.updateTile(x, y, bgTile, 2, background, tilesetconfig);
			}
			return;
		}
		
		// top
		if (this.isHole(other.n)) {
			let bgTile;
			const def = this.CollTiles;
			if (collTile === def.block) {
				bgTile = this.bgTiles.BORDER_N;
			} else if (collTile === def.block_sw || collTile === def.block_sw + def.block_hole_offset) {
				bgTile = this.bgTiles.BORDER_NE;
			} else if (collTile === def.block_se || collTile === def.block_se + def.block_hole_offset) {
				bgTile = this.bgTiles.BORDER_NW;
			} else {
				return;
			}
			Vec2.add(bgTile, tilesetconfig.base.cliff);
			this.updateTile(x, y - yHeight, bgTile, 0, backgroundTop, tilesetconfig);
			return;
		}
		
		// sides
		let bgTile;
		if (this.isHole(other.e)) {
			bgTile = this.bgTiles.BORDER_E;
		}
		if (this.isHole(other.w)) {
			bgTile = this.bgTiles.BORDER_W;
		}
		if (bgTile && collTile === this.CollTiles.block) {
			Vec2.add(bgTile, tilesetconfig.base.cliff);
			this.updateTile(x, y - yHeight, bgTile, 0, backgroundTop, tilesetconfig);
			
			return;
		}
		
		
		// floor
		if (collTile === this.CollTiles.block) {
			let tile = tilesetconfig.base.ground;
			
			// corners
			if (this.isHole(other.nw) && !tilesetconfig.base.blockedTypes.includes('CORNER_NW')) {
				tile = Vec2.add(this.bgTiles.CORNER_NW, tilesetconfig.base.cliff, true);
			} else if (this.isHole(other.ne) && !tilesetconfig.base.blockedTypes.includes('CORNER_NE')) {
				tile = Vec2.add(this.bgTiles.CORNER_NE, tilesetconfig.base.cliff, true);
			} else if (this.isHole(other.se) && !tilesetconfig.base.blockedTypes.includes('CORNER_SE')) {
				tile = Vec2.add(this.bgTiles.CORNER_SE, tilesetconfig.base.cliff, true);
			} else if (this.isHole(other.sw) && !tilesetconfig.base.blockedTypes.includes('CORNER_SW')) {
				tile = Vec2.add(this.bgTiles.CORNER_SW, tilesetconfig.base.cliff, true);
			}
			
			backgroundTop.updateTileChecked(x, y - yHeight, background.getTile(tile.x, tile.y));
			return;
		}
	}
	
	
	// returns true if at least one pattern matches
	private dirCompare(neighbours: Dir, minIndex: number, ...patternString: string[]): boolean {
		return patternString.some(str => {
			const pattern = str.split(' ');
			let out = true;
			Object.keys(neighbours).forEach(key => {
				const index = neighbours[key] % this.typeOffset;
				if (pattern.includes(key)) {
					if (index < minIndex) {
						out = false;
					}
				} else {
					if (index >= minIndex) {
						out = false;
					}
				}
			});
			return out;
		});
	}
	
	private getNeighbours(x: number, y: number, layer: CCMapLayer, initial: number, extend: boolean = false): Dir {
		const out: Dir = {
			n: initial,
			ne: initial,
			e: initial,
			se: initial,
			s: initial,
			sw: initial,
			w: initial,
			nw: initial
		};
		
		const w = layer.details.width;
		const h = layer.details.height;
		const data = layer.details.data;
		
		// TODO: i think extend is not neccessary
		
		if (x > 0) {
			out.w = data[y][x - 1];
		} else if (extend) {
			out.w = data[y][x];
		}
		
		if (x < w - 1) {
			out.e = data[y][x + 1];
		} else if (extend) {
			out.e = data[y][x];
		}
		
		if (y > 0) {
			out.n = data[y - 1][x];
		} else if (extend) {
			out.n = data[y][x];
		}
		
		if (y < h - 1) {
			out.s = data[y + 1][x];
		} else if (extend) {
			out.s = data[y][x];
		}
		
		if (x > 0 && y > 0) {
			out.nw = data[y - 1][x - 1];
		} else if (extend) {
			if (x > 0) {
				out.nw = data[y][x - 1];
			} else if (y > 0) {
				out.nw = data[y - 1][x];
			} else {
				out.nw = data[y][x];
			}
		}
		
		if (x < w - 1 && y > 0) {
			out.ne = data[y - 1][x + 1];
		} else if (extend) {
			if (x < w - 1) {
				out.ne = data[y][x + 1];
			} else if (y > 0) {
				out.ne = data[y - 1][x];
			} else {
				out.ne = data[y][x];
			}
		}
		
		if (y < h - 1 && x > 0) {
			out.sw = data[y + 1][x - 1];
		} else if (extend) {
			if (y < h - 1) {
				out.sw = data[y + 1][x];
			} else if (x > 0) {
				out.sw = data[y][x - 1];
			} else {
				out.sw = data[y][x];
			}
		}
		
		if (y < h - 1 && x < w - 1) {
			out.se = data[y + 1][x + 1];
		} else if (extend) {
			if (y < h - 1) {
				out.se = data[y + 1][x];
			} else if (x < w - 1) {
				out.se = data[y][x + 1];
			} else {
				out.se = data[y][x];
			}
		}
		
		return out;
	}
	
	private getTile(x: number, y: number, layer: CCMapLayer, oobValue: number): number {
		if (x < 0 || y < 0 || x >= layer.details.width || y >= layer.details.height) {
			return oobValue;
		}
		return layer.details.data[y][x];
	}
	
	// converts collision tiles into block tiles (for layers below master level)
	private holeToBlock(tile): number {
		const def = this.CollTiles;
		switch (tile) {
			case def.hole:
				return 0;
			case def.hole_nw:
				return def.block_se;
			case def.hole_ne:
				return def.block_sw;
			case def.hole_se:
				return def.block_nw;
			case def.hole_sw:
				return def.block_ne;
			default:
				return def.block;
		}
	}
	
	
	private updateTile(x: number, y: number, tile: Point[], yOffset: number, layer: CCMapLayer, config: TilesetConfig, offsetAlternation: boolean = false) {
		let alternation = this.getAlternate(x, y);
		if (offsetAlternation) {
			alternation = 1 - alternation;
		}
		if (!tile[alternation]) {
			console.log('wtf');
		}
		const newTile = Vec2.assign({}, tile[alternation]);
		newTile.y += yOffset;
		const bgTile = Vec2.add(newTile, config.base.cliff, true);
		layer.updateTileChecked(x, y, layer.getTile(bgTile.x, bgTile.y));
	}
	
	private isHole(tile): boolean {
		return tile < this.CollTiles.block_sw && tile !== this.CollTiles.block;
	}
	
	private getAlternate(x, y) {
		return Math.abs((x + y) % 2);
	}
}
