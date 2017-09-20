import {Point} from '../interfaces/cross-code-map';
import {Globals} from '../globals';

export class Helper {
	/**
	 * Transforms screen coordinates to world coordinates.
	 * Phaser already offers a way to get world coordinates but it's messed up when the camera scales
	 */
	public static screenToWorld(game: Phaser.Game, x: number | Point, y?: number): Point {
		if (y === undefined) {
			y = (<any>x).y;
			x = (<any>x).x;
		}
		const p: Point = {};
		const cam = game.camera;
		p.x = (<any>x + cam.x) / cam.scale.x;
		p.y = (y + cam.y) / cam.scale.y;

		return p;
	}

	public static worldToTile(x: number, y: number): Point {
		const p: Point = {};

		p.x = Math.floor(x / Globals.TILE_SIZE);
		p.y = Math.floor(y / Globals.TILE_SIZE);

		return p;
	}

	public static screenToTile(game: Phaser.Game, x: number | Point, y?: number): Point {
		let p = this.screenToWorld(game, x, y);
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
			x: img.width / Globals.TILE_SIZE,
			y: img.height / Globals.TILE_SIZE
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
}
