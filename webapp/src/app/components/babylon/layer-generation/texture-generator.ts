import {Globals} from '../../../shared/globals';
import {CCMapLayer} from '../../../shared/phaser/tilemap/cc-map-layer';
import {Scene, StandardMaterial, Texture} from '@babylonjs/core';

export class TextureGenerator {
	
	private prevSize = {x: 0, y: 0};
	private layers: CCMapLayer[] = [];
	
	init() {
		const map = Globals.map;
		
		// prepare phaser to take snapshots
		const cam = Globals.scene.cameras.main;
		
		cam.setZoom(1);
		cam.scrollX = 0;
		cam.scrollY = 0;
		
		const gameSize = Globals.game.scale.gameSize;
		this.prevSize.x = gameSize.width;
		this.prevSize.y = gameSize.height;
		this.resize(map.mapWidth, map.mapHeight);
		
		// make only background layers visible and hide entities
		map.layers.forEach(l => l.visible = false);
		const layers = map.layers.filter(l => l.details.type.toLowerCase() === 'background');
		layers.sort((a, b) => a.details.level - b.details.level);
		
		this.layers = layers;
		
		map.entityManager.hideEntities();
		
		Globals.phaserEventsService.showMapBorder.next(false);
	}
	
	destroy() {
		Globals.phaserEventsService.showMapBorder.next(true);
		if (this.prevSize.x > 0) {
			Globals.game.scale.setGameSize(this.prevSize.x, this.prevSize.y);
		}
	}
	
	private resize(width: number, height: number) {
		Globals.game.scale.setGameSize(width * Globals.TILE_SIZE, height * Globals.TILE_SIZE);
	}
	
	public async generate(level: number, scene: Scene) {
		for (const layer of this.layers) {
			layer.visible = layer.details.level <= level;
		}
		
		const layerMaterial = new StandardMaterial('layerMaterial' + level, scene);
		const src = await this.snapshot();
		
		const texture = new Texture('data:level' + level, scene, undefined, undefined, Texture.NEAREST_SAMPLINGMODE, undefined, undefined, src);
		texture.wrapU = Texture.CLAMP_ADDRESSMODE;
		texture.wrapV = Texture.CLAMP_ADDRESSMODE;
		
		layerMaterial.diffuseTexture = texture;
		
		return layerMaterial;
	}
	
	private async snapshot(): Promise<string> {
		return new Promise((res, rej) => {
			Globals.game.renderer.snapshot(img => {
				const src = (img as HTMLImageElement).src;
				// src = src.split(/base64,(.+)/)[1];
				res(src);
			});
		});
		
	}
}
