import {Point} from '../../models/cross-code-map';
import {Globals} from '../globals';
import {CCMapLayer} from './tilemap/cc-map-layer';
import {api} from 'cc-map-editor-common';
import Scene = Phaser.Scene;

export class Helper {
	
	public static worldToTile(x: number, y: number): Point {
		const p: Point = {x: 0, y: 0};
		
		p.x = Math.floor(x / Globals.TILE_SIZE);
		p.y = Math.floor(y / Globals.TILE_SIZE);
		
		return p;
	}
	
	public static getPointerPos(pointer: Phaser.Input.Pointer): Point {
		return {x: pointer.worldX, y: pointer.worldY};
	}
	
	public static getTilesetSize(scene: Phaser.Scene, tileset: string): Point {
		const img = scene.textures.get(tileset).source[0];
		return {
			x: Math.ceil(img.width / Globals.TILE_SIZE),
			y: Math.ceil(img.height / Globals.TILE_SIZE)
		};
	}
	
	public static indexToPoint(index: number, tileCountX: number): Point {
		index -= 1;
		return {
			x: index % tileCountX,
			y: Math.floor(index / tileCountX)
		};
	}
	
	public static clamp(val: number, min: number, max: number) {
		return Math.min(Math.max(val, min), max);
	}
	
	public static clampToBounds(layer: CCMapLayer, p: Point) {
		p.x = Helper.clamp(p.x, 0, layer.details.width - 1);
		p.y = Helper.clamp(p.y, 0, layer.details.height - 1);
	}
	
	public static isInBounds(layer: CCMapLayer, p: Point): boolean {
		return p.x >= 0 && p.y >= 0 && p.x < layer.details.width && p.y < layer.details.height;
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
	
	public static getJson(key: string, callback: (json: any) => void) {
		const scene = Globals.scene;
		
		// get json from cache
		if (scene.cache.json.has(key)) {
			return callback(scene.cache.json.get(key));
		}
		
		// load json
		const relativePath = key + '.json';
		let truePath: string;
		if (Globals.isElectron) {
			truePath = api.getResourcePath(relativePath);
		} else {
			truePath = Globals.URL + relativePath;
		}
		
		console.log(`${relativePath} is at ${truePath}`);

		scene.load.json(key, truePath);
		scene.load.once('complete', () => {
			const data: any = scene.cache.json.get(key);
			if (Globals.isElectron) {
				api.patchJson(data, relativePath).then((patchedData: any) => {
					// no longer need to patch every time
					scene.cache.json.remove(key);
					scene.cache.json.add(key, patchedData);
					
					callback(patchedData);
				});
			} else {
				return callback(data);
			}
		});
		scene.load.start();
	}
	
	public static getJsonPromise(key: string) {
		return new Promise(resolve => {
			this.getJson(key, json => resolve(json));
		});
	}
	
	/**
	 * returns true if texture exists, false otherwise
	 */
	public static async loadTexture(key: string | undefined, scene: Scene): Promise<boolean> {
		
		if (!key) {
			return false;
		}
		
		if (scene.textures.exists(key)) {
			return true;
		}
		
		return new Promise(res => {
			let truePath;
			if (Globals.isElectron) {
				truePath = api.getResourcePath(key);
			} else {
				truePath = Globals.URL + key;
			}

			console.log(`${key} is at ${truePath}`);
			scene.load.image(key, truePath);
			scene.load.once('complete', () => res(true));
			scene.load.once('loaderror', () => res(false));
			scene.load.start();
		});
	}
	
	/**
	 * every key listener should check this method and only proceed when
	 * false is returned, so the user can write everything into input fields
	 * without messing up the map
	 * */
	public static isInputFocused(): boolean {
		if (Globals.disablePhaserInput.size > 0) {
			return true;
		}
		if (!document.activeElement) {
			return false;
		}
		const tag = document.activeElement.tagName.toLowerCase();
		
		return tag === 'input' || tag === 'textarea';
	}
}
