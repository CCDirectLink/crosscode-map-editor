import { WallColors } from '../../../../models/map-styles';
import { Globals } from '../../../globals';
import { Helper } from '../../helper';
import { Fix } from '../cc-entity';
import { DefaultEntity } from './default-entity';

export const TILE_W = 8;
export const TILE_H = 9;
export const END_OFF_X = 176;
export const SHEET_OFF_Y = 64;

const WALL_ALPHA = 0.76;

type CollType = 'BLOCK' | 'PBLOCK' | 'NPBLOCK';

const COLL_COLORS: Record<CollType, { front: keyof WallColors; top: keyof WallColors }> = {
	BLOCK: { front: 'blockFront', top: 'blockTop' },
	PBLOCK: { front: 'pBlockFront', top: 'pBlockTop' },
	NPBLOCK: { front: 'npBlockFront', top: 'npBlockTop' },
};

function hexToNumber(hex: string): number {
	return parseInt(hex.replace('#', ''), 16);
}

function tintFix(width: number, height: number, offsetY: number, tint: number): Fix {
	return {
		gfx: 'pixel',
		x: 0,
		y: 0,
		w: width,
		h: height,
		scaleX: width,
		scaleY: height,
		tint,
		alpha: WALL_ALPHA,
		scalable: false,
		offsetX: width / 2,
		offsetY,
		ignoreBoundingboxX: true,
	};
}

export interface WallContext {
	sheet: string;
	frontTint: number;
	topTint: number;
}

export abstract class BaseWall extends DefaultEntity {
	
	protected resolveWallContext(collType: string | undefined): WallContext | undefined {
		const sheet = Helper.getMapStyle(Globals.map, 'puzzle')?.sheet;
		const colors = Helper.getMapStyle(Globals.map, 'walls')?.colors;
		if (!sheet || !colors) {
			return undefined;
		}
		const keys = COLL_COLORS[collType as CollType] ?? COLL_COLORS.BLOCK;
		return {
			sheet,
			frontTint: hexToNumber(colors[keys.front]),
			topTint: hexToNumber(colors[keys.top]),
		};
	}
	
	protected async pushWallBody(
		width: number,
		topDepth: number,
		wallZHeight: number,
		frontTint: number,
		topTint: number,
	): Promise<void> {
		// front face
		await this.pushFix(tintFix(width, wallZHeight, -1, frontTint));
		// top face
		await this.pushFix(tintFix(width, topDepth, -wallZHeight - 1, topTint));
		// effect overlay (lighter blend)
		await this.pushFix({
			gfx: 'media/entity/objects/object-effects.png',
			x: 176,
			y: 0,
			w: 16,
			h: 16,
			alpha: WALL_ALPHA,
			renderMode: 'lighter',
			renderHeight: wallZHeight + 1,
			offsetY: 1,
		});
	}
}
