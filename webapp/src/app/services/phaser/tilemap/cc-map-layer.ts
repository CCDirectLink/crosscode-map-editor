import * as Phaser from 'phaser';
import { BlendModes } from 'phaser';
import { MapLayer, Point } from '../../../models/cross-code-map';
import { Helper } from '../helper';
import { customPutTilesAt } from './layer-helper';
import { Globals } from '../../globals';
import Tile = Phaser.Tilemaps.Tile;

export class CCMapLayer {
	
	public details!: MapLayer;
	
	private layer!: Phaser.Tilemaps.TilemapLayer;
	private border!: Phaser.GameObjects.Rectangle;
	private container!: Phaser.GameObjects.Container;
	
	constructor(
		private tilemap: Phaser.Tilemaps.Tilemap
	) {
	}
	
	public async init(details: MapLayer) {
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
		this.border = this.tilemap.scene.add.rectangle();
		this.border.visible = false;
		this.container = this.tilemap.scene.add.container(0, 0, this.border);
		this.container.depth = 999;
		this.makeLayer('stub');
		this.updateBorder();
		if (details.data) {
			customPutTilesAt(details.data, this.layer);
		}
		await this.updateTileset(details.tilesetName!);
		
		const skip = 'Navigation Collision HeightMap'.split(' ');
		// const skip = 'Navigation Background HeightMap'.split(' ');
		skip.forEach(type => {
			if (type === details.type) {
				this.visible = false;
			}
		});
	}
	
	get visible(): boolean {
		return this.layer.visible;
	}
	
	set visible(val: boolean) {
		this.container.visible = val;
		this.container.active = val;
		this.layer.visible = val;
		this.layer.active = val;
	}
	
	get alpha(): number {
		return this.layer.alpha;
	}
	
	set alpha(val: number) {
		this.layer.alpha = val;
	}
	
	get x(): number {
		return this.container.x;
	}
	
	get y(): number {
		return this.container.y;
	}
	
	destroy() {
		this.container.destroy(true);
		this.layer?.destroy(true);
	}
	
	select(val: boolean) {
		if (val) {
			this.visible = true;
		}
		this.border.visible = val;
	}
	
	offsetLayer(offset: Point, borderTiles = false) {
		const data = this.layer.layer.data;
		const newData: number[][] = [];
		
		for (let y = 0; y < data.length; y++) {
			newData[y] = [];
			for (let x = 0; x < data[y].length; x++) {
				let newTile: Tile | undefined;
				let row = data[y - offset.y];
				if (!row && borderTiles) {
					row = offset.y > 0 ? data[0] : data[data.length - 1];
				}
				if (row) {
					newTile = row[x - offset.x];
					if (borderTiles && newTile === undefined) {
						newTile = offset.x > 0 ? row[0] : row[row.length - 1];
					}
				}
				newData[y][x] = newTile?.index ?? 0;
			}
		}
		customPutTilesAt(newData, this.layer);
	}
	
	resize(width: number, height: number) {
		const data = this.layer.layer.data;
		this.details.width = width;
		this.details.height = height;
		
		const newData: number[][] = [];
		for (let y = 0; y < height; y++) {
			newData[y] = [];
			const old = data[y] || [];
			for (let x = 0; x < width; x++) {
				newData[y][x] = old[x]?.index ?? 0;
			}
		}
		const visible = this.layer.visible;
		this.makeLayer(undefined, newData);
		this.updateBorder();
		
		this.visible = visible;
	}
	
	async updateTileset(tilesetname: string) {
		const details = this.details;
		details.tilesetName = tilesetname;
		
		await Helper.loadTexture(tilesetname, this.tilemap.scene);
		
		const newTileset = this.tilemap.addTilesetImage(tilesetname, undefined, undefined, undefined, undefined, undefined, 1);
		this.makeLayer(newTileset ?? []);
		
		this.updateLevel(this.details.level);
		this.updateLighter(!!this.details.lighter);
	}
	
	updateLevel(level: number) {
		this.details.level = level;
		let zIndex = this.details.level * 10;
		if (isNaN(zIndex)) {
			zIndex = 999;
		}
		this.layer.depth = this.details.level * 10;
	}
	
	setOffset(x: number, y: number) {
		this.container.x = x;
		this.container.y = y;
		this.layer.x = x;
		this.layer.y = y;
	}
	
	updateLighter(lighter: boolean) {
		this.details.lighter = lighter;
		const blendMode = lighter ? BlendModes.ADD : BlendModes.NORMAL;
		this.layer.setBlendMode(blendMode);
	}
	
	getPhaserLayer(): Phaser.Tilemaps.TilemapLayer {
		return this.layer;
	}
	
	private makeLayer(tileset?: string | string[] | Phaser.Tilemaps.Tileset, tiles?: Tile[][] | number[][]) {
		const oldLayer = this.layer as typeof this.layer | undefined;
		
		if (!tileset) {
			tileset = oldLayer?.tileset[0]?.name ?? [];
		}
		if (!tiles) {
			tiles = oldLayer?.layer?.data;
		}
		this.layer = this.tilemap.createBlankLayer(this.details.name + Math.random(), tileset, 0, 0, this.details.width, this.details.height)!;
		if (tiles) {
			customPutTilesAt(tiles, this.layer);
		}
		this.layer.alpha = oldLayer?.alpha ?? 1;
		this.setOffset(this.container.x, this.container.y);
		this.updateLevel(this.details.level);
		if (oldLayer) {
			oldLayer.destroy(true);
		}
	}
	
	private updateBorder() {
		const s = Globals.TILE_SIZE;
		
		const borderSize = 2;
		
		this.border.setPosition(-borderSize * 0.5, -borderSize * 0.5);
		this.border.setSize(
			this.details.width * s + borderSize,
			this.details.height * s + borderSize,
		);
		this.border.setStrokeStyle(borderSize, 0xfc4445, 1);
		this.border.setOrigin(0, 0);
	}
	
	exportLayer(): MapLayer {
		const out: MapLayer = Object.assign({}, this.details);
		if (out.levelName) {
			out.level = out.levelName;
			delete out.levelName;
		}
		out.data = [];
		this.extractLayerData(out);
		return out;
	}
	
	private extractLayerData(layer: MapLayer): void {
		this.layer.getTilesWithin().forEach(tile => {
			if (!layer.data[tile.y]) {
				layer.data[tile.y] = [];
			}
			layer.data[tile.y][tile.x] = tile.index;
		});
	}
}
