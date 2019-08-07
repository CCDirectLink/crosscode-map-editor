import {Point} from '../../models/cross-code-map';
import {SettingsService} from '../../services/settings.service';
import {CCMapLayer} from './tilemap/cc-map-layer';

export class Helper {
	
	public static worldToTile(x: number, y: number, settings: SettingsService): Point {
		const p: Point = {x: 0, y: 0};
		
		p.x = Math.floor(x / settings.TILE_SIZE);
		p.y = Math.floor(y / settings.TILE_SIZE);
		
		return p;
	}
	
	public static getPointerPos(pointer: Phaser.Input.Pointer): Point {
		return {x: pointer.worldX, y: pointer.worldY};
	}
	
	public static getTilesetSize(scene: Phaser.Scene, tileset: string, settings: SettingsService): Point {
		const img = scene.textures.get(tileset).source[0];
		return {
			x: Math.ceil(img.width / settings.TILE_SIZE),
			y: Math.ceil(img.height / settings.TILE_SIZE)
		};
	}
	
	public static clamp(val: number, min: number, max: number) {
		return Math.min(Math.max(val, min), max);
	}
	
	public static clampToBounds(layer: CCMapLayer, p: Point) {
		p.x = Helper.clamp(p.x, 0, layer.data.width - 1);
		p.y = Helper.clamp(p.y, 0, layer.data.height - 1);
	}
	
	public static isInBounds(layer: CCMapLayer, p: Point): boolean {
		return p.x >= 0 && p.y >= 0 && p.x < layer.data.width && p.y < layer.data.height;
	}
	
	public static isInBoundsP(bounds: Point, p: Point): boolean {
		return p.x >= 0 && p.y >= 0 && p.x < bounds.x && p.y < bounds.y;
	}
	
	public static drawRect(graphics: Phaser.GameObjects.Graphics, rect: Phaser.Geom.Rectangle, fillStyle: number, alpha: number, strokeStyle: number, strokeAlpha: number) {
		const o = new Phaser.Geom.Rectangle(rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height);
		
		graphics.fillStyle(fillStyle, alpha);
		graphics.fillRect(o.x, o.y, o.width, o.height);
		
		graphics.lineStyle(1, strokeStyle, strokeAlpha);
		graphics.strokeRect(o.x, o.y, o.width, o.height);
	}
	
	/** copies obj via JSON.parse(JSON.stringify(obj)); */
	public static copy(obj: any) {
		return JSON.parse(JSON.stringify(obj));
	}
	
	public static getJson(key: string, callback: (json: any) => void, settings: SettingsService, scene: Phaser.Scene) {
		// get json from cache
		if (scene.cache.json.has(key)) {
			return callback(scene.cache.json.get(key));
		}
		
		// load json
		scene.load.json(key, settings.URL + key + '.json');
		scene.load.once('complete', () => {
			return callback(scene.cache.json.get(key));
		});
		scene.load.start();
	}
	
	public static getJsonPromise(key: string, settings: SettingsService, scene: Phaser.Scene): any {
		return new Promise(resolve => {
			this.getJson(key, json => resolve(json), settings, scene);
		});
	}
	
	/**
	 * every key listener should check this method and only proceed when
	 * false is returned, so the user can write everything into input fields
	 * without messing up the map
	 * */
	public static isInputFocused(
		settings: SettingsService
	): boolean {
		if (settings.disablePhaserInput) {
			return true;
		}
		if (!document.activeElement) {
			return false;
		}
		const tag = document.activeElement.tagName.toLowerCase();
		
		return tag === 'input' || tag === 'textarea';
	}
}
