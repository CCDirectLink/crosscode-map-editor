import { WallColors } from '../../../../models/map-styles';
import { Fix } from '../cc-entity';

export const TILE_W = 8;
export const TILE_H = 9;

export const END_OFF_X = 176;
export const SHEET_OFF_Y = 64;

export const WALL_ALPHA = 0.76;

export function wallEffectOverlayFix(wallZHeight: number): Fix {
	return {
		gfx: 'media/entity/objects/object-effects.png',
		x: 176,
		y: 0,
		w: 16,
		h: 16,
		alpha: WALL_ALPHA,
		renderMode: 'lighter',
		renderHeight: wallZHeight + 1,
		offsetY: 1,
	};
}

type CollType = 'BLOCK' | 'PBLOCK' | 'NPBLOCK';

const COLL_COLORS: Record<CollType, { front: keyof WallColors; top: keyof WallColors }> = {
	BLOCK: { front: 'blockFront', top: 'blockTop' },
	PBLOCK: { front: 'pBlockFront', top: 'pBlockTop' },
	NPBLOCK: { front: 'npBlockFront', top: 'npBlockTop' },
};

function hexToNumber(hex: string): number {
	return parseInt(hex.replace('#', ''), 16);
}

export function resolveWallColors(
	collType: string | undefined,
	colors: WallColors,
): { front: number; top: number } {
	const keys = COLL_COLORS[collType as CollType] ?? COLL_COLORS.BLOCK;
	return { front: hexToNumber(colors[keys.front]), top: hexToNumber(colors[keys.top]) };
}
