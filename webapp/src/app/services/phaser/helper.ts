import mapStyles from '../../../../../webapp/src/assets/map-styles.json';
import { Point } from '../../models/cross-code-map';
import { MapStyles } from '../../models/map-styles';
import { Globals } from '../globals';
import { CCMap } from './tilemap/cc-map';
import { CCMapLayer } from './tilemap/cc-map-layer';
import Scene = Phaser.Scene;

export class Helper {
	
	// stores promises so editor doesn't try to load the same file multiple times simultaneously
	private static cache: {
		[key: string]: Promise<any> | undefined;
	} = {};
	
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
	public static copy<T>(obj: T): T {
		if (!obj) {
			return obj;
		}
		return JSON.parse(JSON.stringify(obj));
	}
	
	public static async getJson<T>(key: string): Promise<T | undefined> {
		const jsonKey = key + '.json';
		const scene = Globals.scene;
		
		if (scene.cache.json.has(jsonKey)) {
			return scene.cache.json.get(jsonKey);
		}
		
		if (this.cache[jsonKey]) {
			return this.cache[jsonKey];
		}
		
		const promise = new Promise<T | undefined>(res => {
			Globals.httpService.resolveFile(jsonKey).subscribe(file => {
				// load json
				scene.load.json(jsonKey, Globals.URL + file);
				scene.load.once(`filecomplete-json-${jsonKey}`, () => {
					return res(scene.cache.json.get(jsonKey));
				});
				scene.load.start();
			}, () => {
				console.warn(`Failed to resolve resource: ${jsonKey}`);
				res(undefined);
			});
		});
		this.cache[jsonKey] = promise;
		return promise;
	}
	
	/**
	 * returns true if texture exists, false otherwise
	 */
	public static async loadTexture(name: string | undefined, scene: Scene): Promise<boolean> {
		if (!name) {
			return false;
		}
		
		//Sometimes RFG adds a whitespace after (or even in front) of the name.
		//This is invalid behaviour for loading a file but the game trims it as well.
		const key = name.trim();
		
		if (scene.textures.exists(key)) {
			return true;
		}
		
		if (this.cache[key]) {
			return this.cache[key];
		}
		const promise = this.loadTextureInternal(key, scene);
		this.cache[key] = promise;
		return promise;
	}
	
	private static async loadTextureInternal(key: string, scene: Scene) {
		const file = await Globals.httpService.resolveFile(key).toPromise().catch(() => false);
		if (!file) {
			return false;
		}
		
		return new Promise<boolean>(res => {
			scene.load.image(key, Globals.URL + file);
			scene.load.once(`filecomplete-image-${key}`, () => res(true));
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
	
	public static getMapStyle(map: CCMap, type: string): MapStyles {
		const mapStyleName = map.attributes.mapStyle || 'default';
		const mapStyle = mapStyles[mapStyleName];
		if (mapStyle && mapStyle[type]) {
			return mapStyle[type];
		}
		return mapStyles.default[type];
	}
	
	public static async asyncFilter<T>(arr: T[], predicate: (v: T) => Promise<boolean>) {
		const results = await Promise.all(arr.map(predicate));
		return arr.filter((_v, index) => results[index]);
	}
}
