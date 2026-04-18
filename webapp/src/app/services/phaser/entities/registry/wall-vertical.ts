import { Fix } from '../cc-entity';
import { BaseWall, END_OFF_X, SHEET_OFF_Y, TILE_H, TILE_W } from './base-wall';

const MIDDLE_TILE_H = 16;

export interface WallVerticalAttributes {
	skipRender?: boolean;
	topEnd?: string;
	bottomEnd?: string;
	collType?: string;
	wallZHeight?: number;
}

const BASE_X = 8;

const TOP_TILE_IDX: Record<string, number | undefined> = {
	STOP: 5,
	CORNER_LEFT: 4,
	CORNER_RIGHT: 6,
};
const BOTTOM_TILE_IDX: Record<string, number | undefined> = {
	STOP: 8,
	CORNER_LEFT: 7,
	CORNER_RIGHT: 9,
};

export class WallVertical extends BaseWall {
	
	protected override async setupType(settings: WallVerticalAttributes): Promise<void> {
		if (settings.skipRender) {
			this.generateNoImageType();
			return;
		}
		
		const ctx = this.resolveWallContext(settings.collType);
		if (!ctx) {
			this.generateErrorImage();
			return;
		}
		const { sheet, frontTint, topTint } = ctx;
		
		const wallZHeight = settings.wallZHeight ?? 32;
		const topIdx = settings.topEnd ? TOP_TILE_IDX[settings.topEnd] : undefined;
		const botIdx = settings.bottomEnd ? BOTTOM_TILE_IDX[settings.bottomEnd] : undefined;
		const hasTop = topIdx !== undefined;
		const hasBot = botIdx !== undefined;
		
		const size = this.details.settings['size'] as { x: number; y: number } | undefined;
		const length = size?.y ?? MIDDLE_TILE_H;
		
		// middle pattern (scalable Y) — shrunk so it doesn't bleed into the
		// end tiles' transparent corners; extends 1px past length when no bottom end
		const middle: Fix = {
			gfx: sheet,
			x: 184,
			y: SHEET_OFF_Y,
			w: TILE_W,
			h: MIDDLE_TILE_H,
			alpha: 1,
			offsetY: hasTop ? -TILE_W : 0,
			offsetHeight: (hasBot ? TILE_W : -1) + (hasTop ? 2 * TILE_W : 0),
		};
		if (!await this.pushFix(middle, true)) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings.baseSize = { x: BASE_X, y: length, z: 0 };
		
		const pushEndTile = async (idx: number, offsetY: number) => {
			await this.pushFix({
				gfx: sheet,
				x: END_OFF_X + idx * TILE_W,
				y: SHEET_OFF_Y,
				w: TILE_W,
				h: TILE_H,
				alpha: 1,
				scalable: false,
				offsetX: TILE_W / 2,
				offsetY,
				ignoreBoundingboxX: true,
			});
		};
		if (topIdx !== undefined) {
			await pushEndTile(topIdx, TILE_H - 1 - length);
		}
		if (botIdx !== undefined) {
			await pushEndTile(botIdx, 1);
		}
		
		await this.pushWallBody(BASE_X, length, wallZHeight, frontTint, topTint);
		
		this.entitySettings.bboxYOffset = -1;
		this.updateSettings();
	}
}
