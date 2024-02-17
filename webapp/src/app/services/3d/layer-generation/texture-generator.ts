import { Scene, StandardMaterial, Texture } from '@babylonjs/core';
import { Point } from '../../../models/cross-code-map';
import { Globals } from '../../globals';
import { CCMapLayer } from '../../phaser/tilemap/cc-map-layer';

export class TextureGenerator {
	private layers: CCMapLayer[] = [];
	private ctx!: CanvasRenderingContext2D;
	private startLayer = 0;
	
	init() {
		const map = Globals.map;
		
		const canvas = document.createElement('canvas');
		canvas.width = map.mapWidth * Globals.TILE_SIZE;
		canvas.height = map.mapHeight * Globals.TILE_SIZE;
		
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Could not get context of buffer canvas');
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.ctx = ctx;
		
		this.layers = map.layers
			.filter(l => l.details.type.toLowerCase() === 'background')
			.sort((a, b) => a.details.level - b.details.level);
		
	}
	
	destroy() {
	}
	
	/**
	 * Assumes that on every call layer is only increased.
	 * @param level
	 * @param scene
	 */
	public generate(level: number, scene: Scene) {
		for (const layer of this.layers) {
			layer.visible = layer.details.level <= level;
		}
		
		const layerMaterial = new StandardMaterial('layerMaterial' + level, scene);
		this.snapshot(level);
		
		const texture = new Texture('data:level' + level, scene, undefined, undefined, Texture.NEAREST_SAMPLINGMODE, undefined, undefined, this.ctx.canvas.toDataURL());
		texture.wrapU = Texture.CLAMP_ADDRESSMODE;
		texture.wrapV = Texture.CLAMP_ADDRESSMODE;
		
		layerMaterial.diffuseTexture = texture;
		
		return layerMaterial;
	}
	
	private snapshot(level: number) {
		const ctx = this.ctx;
		let i = this.startLayer;
		for (; i < this.layers.length && this.layers[i].details.level <= level; i++) {
			const layer = this.layers[i];
			const phaserLayer = layer.getPhaserLayer()!;
			
			const tiles = phaserLayer.getTilesWithin();
			for (const tile of tiles) {
				const index = tile.index;
				const x = tile.x;
				const y = tile.y;
				const tileset = tile.tileset;
				if (!tileset) {
					continue;
				}
				const tilesetImage = tileset.image?.source[0].image;
				if (!tilesetImage) {
					throw new Error('tilesetImage is not defined');
				}
				const uv = tile.tileset.getTileTextureCoordinates(index) as Point;
				
				ctx.drawImage(tilesetImage,
					uv.x, uv.y, Globals.TILE_SIZE, Globals.TILE_SIZE,
					x * Globals.TILE_SIZE, y * Globals.TILE_SIZE, Globals.TILE_SIZE, Globals.TILE_SIZE);
			}
		}
		this.startLayer = i;
	}
}
