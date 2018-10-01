import {Injectable} from '@angular/core';
import {SharedModule} from '../shared.module';
import {GlobalEventsService} from '../global-events.service';
import {Globals} from '../globals';
import {CCMapLayer} from '../phaser/tilemap/cc-map-layer';
import {Point} from '../interfaces/cross-code-map';

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

@Injectable({
	providedIn: SharedModule
})
export class HeightMapGeneratorService {
	
	// height map tiles
	private level0Id = 9;
	private levelOffset = 8;
	private typeOffset = 128;
	
	// collision Tiles
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
	
	constructor(private events: GlobalEventsService) {
	}
	
	public init() {
		this.events.generateHeights.subscribe(val => this.generateHeights());
	}
	
	private generateHeights() {
		const game = Globals.game;
		const map = Globals.map;
		
		const masterLevel = map.masterLevel;
		const heightmap = map.layers.find(layer => layer.details.type === 'HeightMap');
		
		for (let i = masterLevel; i < map.levels.length; i++) {
			const collision = map.layers.find(layer => layer.details.level === i && layer.details.type === 'Collision');
			if (!collision) {
				console.warn(`collision for level ${i} not found`);
				continue;
			}
			collision.clear();
			if (i === masterLevel && masterLevel > 0) {
				this.generateCollisions(collision, heightmap, i - 1, masterLevel, map.levels[i - 1].height - map.levels[masterLevel].height);
			}
			this.generateCollisions(collision, heightmap, i, masterLevel, map.levels[i].height - map.levels[masterLevel].height);
			
		}
		
	}
	
	generateCollisions(collisions: CCMapLayer, heightmap: CCMapLayer, level: number, masterLevel, height: number) {
		const data = heightmap.details.data;
		const coll = collisions.details.data;
		const minId = this.level0Id + this.levelOffset * (level + 1);
		for (let y = 0; y < data.length; y++) {
			for (let x = 0; x < data[y].length; x++) {
				const tile = data[y][x] % this.typeOffset;
				if (tile < minId && level >= masterLevel) {
					continue;
				}
				const other = this.getNeighbours(x, y, heightmap, tile);
				
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
					if (tile <= this.level0Id) {
						tileId = def.hole;
					} else {
						switch (tileId) {
							case def.block:
								continue;
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
				
				collisions.drawTile(x, y, tileId);
				
			}
		}
		collisions.renderAll();
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
	
	private getNeighbours(x: number, y: number, layer: CCMapLayer, initial: number): Dir {
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
		
		if (x > 0) {
			out.w = layer.details.data[y][x - 1];
		}
		if (x < layer.details.width - 1) {
			out.e = layer.details.data[y][x + 1];
		}
		if (y > 0) {
			out.n = layer.details.data[y - 1][x];
		}
		if (y < layer.details.height - 1) {
			out.s = layer.details.data[y + 1][x];
		}
		
		if (x > 0 && y > 0) {
			out.nw = layer.details.data[y - 1][x - 1];
		}
		if (x < layer.details.width - 1 && y > 0) {
			out.ne = layer.details.data[y - 1][x + 1];
		}
		if (y < layer.details.height - 1 && x > 0) {
			out.sw = layer.details.data[y + 1][x - 1];
		}
		if (y < layer.details.height - 1 && x < layer.details.width - 1) {
			out.se = layer.details.data[y + 1][x + 1];
		}
		
		return out;
	}
}
