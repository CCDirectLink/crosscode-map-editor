import {Point} from '../interfaces/cross-code-map';
import {Globals} from '../globals';

export class Helper {
	/**
	 * Transforms screen coordinates to world coordinates.
	 * Phaser already offers a way to get world coordinates but it's messed up when the camera scales
	 */
	public static screenToWorld(game: Phaser.Game, x: number, y: number): Point {
		const p = <any>{};
		const cam = game.camera;
		p.x = (x + cam.x) / cam.scale.x;
		p.y = (y + cam.y) / cam.scale.y;

		return p;
	}

	public static worldToTile(x: number, y: number): Point {
		const p = <any>{};

		p.x = Math.floor(x / Globals.tileSize);
		p.y = Math.floor(y / Globals.tileSize);

		return p;
	}

	public static screenToTile(game: Phaser.Game, x: number, y: number): Point {
		let p = this.screenToWorld(game, x, y);
		p = this.worldToTile(p.x, p.y);
		return p;
	}

	/** gets the position of the tile in the tilemap */
	public static getTilePos(tilesetSize: Point, index: number): Point {
		const tilesize = Globals.tileSize;
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
			x: img.width / Globals.tileSize,
			y: img.height / Globals.tileSize
		};
	}

	public static clamp(val, min, max) {
		return Math.min(Math.max(val, min), max);
	}
}
