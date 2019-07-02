import {MapLayer, Point} from '../../../models/cross-code-map';
import * as Phaser from 'phaser';
import {Helper} from '../helper';

export class CCMapLayer {
	
	public details: MapLayer;
	
	private layer: Phaser.Tilemaps.DynamicTilemapLayer;
	
	constructor(
		private tilemap: Phaser.Tilemaps.Tilemap,
		details: MapLayer,
		scene: Phaser.Scene
	) {
		if (typeof details.level === 'string') {
			// possible levels
			// 'first'
			// 'last'
			// 'light'
			// 'postlight'
			// 'object1'
			// 'object2'
			// 'object3'
			if (!isNaN(<any>details.level)) {
				details.level = parseInt(details.level, 10);
			} else {
				details.levelName = details.level;
				if (details.level.startsWith('first')) {
					details.level = 0;
				} else {
					// TODO: get actual max level;
					details.level = 10;
				}
			}
		}
		// noinspection SuspiciousTypeOfGuard
		if (typeof details.distance === 'string') {
			details.distance = parseFloat(details.distance);
		}
		this.details = details;
		
		tilemap.addTilesetImage(details.tilesetName);
		this.layer = tilemap.createBlankDynamicLayer(details.name + Math.random(), details.tilesetName, 0, 0, details.width, details.height);
		this.layer.putTilesAt(details.data.map(row => row.map(v => v - 1)), 0, 0, true);
		
		const skip = 'Navigation Collision HeightMap'.split(' ');
		// const skip = 'Navigation Background HeightMap'.split(' ');
		skip.forEach(type => {
			if (type === details.type) {
				this.layer.visible = false;
			}
		});
		
		this.updateLevel(this.details.level);
		this.updateTileset(details.tilesetName);
	}
	
	get visible(): boolean {
		return this.layer.visible;
	}
	
	set visible(val: boolean) {
		this.layer.visible = val;
	}
	
	destroy() {
		this.layer.destroy();
	}
	
	offsetLayer(offset: Point, borderTiles = false, skipRender = false) {
		// const data = this.details.data;
		// const newData: number[][] = JSON.parse(JSON.stringify(data));
		//
		// for (let y = 0; y < data.length; y++) {
		// 	for (let x = 0; x < data[y].length; x++) {
		// 		let newTile = 0;
		// 		let row = data[y - offset.y];
		// 		if (!row && borderTiles) {
		// 			row = offset.y > 0 ? data[0] : data[data.length - 1];
		// 		}
		// 		if (row) {
		// 			newTile = row[x - offset.x];
		// 			if (borderTiles && newTile === undefined) {
		// 				newTile = offset.x > 0 ? row[0] : row[row.length - 1];
		// 			}
		// 		}
		// 		newData[y][x] = newTile || 0;
		// 	}
		// }
		//
		// this.details.data = newData;
		// if (!skipRender) {
		// 	this.renderAll();
		// }
	}
	
	updateTileset(tilesetname: string) {
		const details = this.details;
		details.tilesetName = tilesetname;
		if (details.tilesetName) {
			const newTileset = this.tilemap.addTilesetImage(tilesetname);
			this.layer.tileset = [newTileset];
		}
	}
	
	updateLevel(level: number) {
		this.details.level = level;
		let zIndex = this.details.level * 10;
		if (isNaN(zIndex)) {
			zIndex = 999;
		}
		this.layer.depth = this.details.level * 10;
	}
	
	fill(newTile: number, p: Point) {
		// const data = this.details.data;
		// const prev = data[p.y][p.x];
		// if (newTile === prev) {
		// 	return;
		// }
		//
		// let toCheck: Point[] = [p];
		// while (toCheck.length > 0) {
		// 	const currP = toCheck.pop();
		// 	const tile = data[currP.y][currP.x];
		// 	if (tile === prev) {
		// 		data[currP.y][currP.x] = newTile;
		// 		toCheck = toCheck.concat(this.getNeighbours(currP));
		// 	}
		// }
		//
		// this.renderAll();
	}
	
	// private getNeighbours(p: Point): Point[] {
	// 	const out: Point[] = [];
	//
	// 	if (p.x > 0) {
	// 		out.push({x: p.x - 1, y: p.y});
	// 	}
	// 	if (p.x < this.details.width - 1) {
	// 		out.push({x: p.x + 1, y: p.y});
	// 	}
	// 	if (p.y > 0) {
	// 		out.push({x: p.x, y: p.y - 1});
	// 	}
	// 	if (p.y < this.details.height - 1) {
	// 		out.push({x: p.x, y: p.y + 1});
	// 	}
	//
	// 	return out;
	// }
	
	exportLayer(): MapLayer {
		// const out: MapLayer = Object.assign({}, this.details);
		// if (out.levelName) {
		// 	out.level = out.levelName;
		// 	out.levelName = undefined;
		// }
		// return out;
		return <any>{};
	}
}
