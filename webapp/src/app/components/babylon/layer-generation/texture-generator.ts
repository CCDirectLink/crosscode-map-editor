import {Globals} from '../../../shared/globals';
import {CCMapLayer} from '../../../shared/phaser/tilemap/cc-map-layer';
import {getLevelOffset} from './offset-helper';

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
		
		// make only background layers visible and hide entities
		map.layers.forEach(l => l.visible = false);
		const layers = map.layers.filter(l => l.details.type.toLowerCase() === 'background');
		layers.sort((a, b) => a.details.level - b.details.level);
		
		this.layers = layers;
		
		map.entityManager.hideEntities();
		
		Globals.phaserEventsService.showMapBorder.next(false);
	}
	
	destroy() {
		// Globals.phaserEventsService.showMapBorder.next(true);
		// if (this.prevSize.x > 0) {
		// 	Globals.game.scale.setGameSize(this.prevSize.x, this.prevSize.y);
		// }
	}
	
	private resize(width: number, height: number) {
		Globals.game.scale.setGameSize(width * Globals.TILE_SIZE, height * Globals.TILE_SIZE);
	}
	
	public async generate(level: number): Promise<string> {
		for (const layer of this.layers) {
			layer.visible = layer.details.level <= level;
		}
		const offset = getLevelOffset(level) * 0;
		Globals.scene.cameras.main.scrollY = -offset;
		
		const map = Globals.map;
		this.resize(map.mapWidth, map.mapHeight + offset / Globals.TILE_SIZE);
		
		const src = await this.snapshot();
		
		return src;
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
