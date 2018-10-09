import {Point} from '../interfaces/cross-code-map';
import {Globals} from '../globals';
import {CCMapLayer} from './tilemap/cc-map-layer';

export class Helper {
	/**
	 * Transforms screen coordinates to world coordinates.
	 * Phaser already offers a way to get world coordinates but it's messed up when the camera scales
	 */
	public static screenToWorld(x: number | Point, y?: number): Point {
		if (y === undefined) {
			y = (<any>x).y;
			x = (<any>x).x;
		}
		const p: Point = {};
		const cam = Globals.game.camera;
		p.x = (<any>x + cam.x) / cam.scale.x;
		p.y = (y + cam.y) / cam.scale.y;
		
		return p;
	}
	
	/** Transforms phaser world coordinates to actual world coordinates (see {@link screenToWorld}) */
	public static phaserWorldtoWorld(p: Point): Point {
		const out: Point = {};
		const cam = Globals.game.camera;
		out.x = p.x / cam.scale.x;
		out.y = p.y / cam.scale.y;
		return out;
	}
	
	public static worldToTile(x: number, y: number): Point {
		const p: Point = {};
		
		p.x = Math.floor(x / Globals.TILE_SIZE);
		p.y = Math.floor(y / Globals.TILE_SIZE);
		
		return p;
	}
	
	public static screenToTile(x: number | Point, y?: number): Point {
		let p = this.screenToWorld(x, y);
		p = this.worldToTile(p.x, p.y);
		return p;
	}
	
	/** gets the position of the tile in the tilemap */
	public static getTilePos(tilesetSize: Point, index: number): Point {
		const tilesize = Globals.TILE_SIZE;
		const pos = {x: 0, y: 0};
		
		pos.x = index % tilesetSize.x;
		pos.y = Math.floor(index / tilesetSize.x);
		
		if (pos.x === 0) {
			pos.x = tilesetSize.x;
			pos.y--;
		}
		pos.x--;
		
		return pos;
	}
	
	public static getTilesetSize(img: HTMLImageElement): Point {
		return {
			x: Math.ceil(img.width / Globals.TILE_SIZE),
			y: Math.ceil(img.height / Globals.TILE_SIZE)
		};
	}
	
	public static clamp(val, min, max) {
		return Math.min(Math.max(val, min), max);
	}
	
	public static drawRect(context: CanvasRenderingContext2D, rect: Phaser.Rectangle, fillStyle, strokeStyle) {
		const o = new Phaser.Rectangle(rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height);
		
		context.fillStyle = fillStyle;
		context.fillRect(o.x, o.y, o.width, o.height);
		
		context.lineWidth = 1;
		context.strokeStyle = strokeStyle;
		context.strokeRect(o.x, o.y, o.width, o.height);
	}
	
	public static deepFind(key, obj) {
		const paths = key.split('.');
		let current = obj;
		
		for (let i = 0; i < paths.length; ++i) {
			if (current[paths[i]] === undefined || current[paths[i]] === null) {
				return current[paths[i]];
			} else {
				current = current[paths[i]];
			}
		}
		return current;
	}
	
	/** copies obj via JSON.parse(JSON.stringify(obj)); */
	public static copy(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	
	public static getJson(key: string, callback: (json) => void) {
		const game = Globals.game;
		
		// get json from cache
		if (game.cache.checkJSONKey(key)) {
			return callback(game.cache.getJSON(key));
		}
		
		// load json
		game.load.json(key, Globals.URL + key + '.json');
		game.load.onLoadComplete.addOnce(() => {
			return callback(game.cache.getJSON(key));
		});
		game.load.crossOrigin = 'anonymous';
		game.load.start();
	}
	
	/**
	 * every key listener should check this method and only proceed when
	 * false is returned, so the user can write everything into input fields
	 * without messing up the map
	 * */
	public static isInputFocused() {
		if (Globals.disablePhaserInput) {
			return true;
		}
		const tag = document.activeElement.tagName.toLowerCase();
		
		return tag === 'input' || tag === 'textarea';
	}
}
