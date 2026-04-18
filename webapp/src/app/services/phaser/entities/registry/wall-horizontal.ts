import { Fix } from '../cc-entity';
import { BaseWall, END_OFF_X, SHEET_OFF_Y, TILE_H, TILE_W } from './base-wall';

export interface WallHorizontalAttributes {
	skipRender?: boolean;
	leftEnd?: string;
	rightEnd?: string;
	collType?: string;
	wallZHeight?: number;
}

const BASE_Y = 8;

export class WallHorizontal extends BaseWall {
	
	protected override async setupType(settings: WallHorizontalAttributes): Promise<void> {
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
		const leftEnd = settings.leftEnd && settings.leftEnd !== 'CONTINUE';
		const rightEnd = settings.rightEnd && settings.rightEnd !== 'CONTINUE';
		
		const size = this.details.settings['size'] as { x: number; y: number } | undefined;
		const width = size?.x ?? TILE_W;
		
		const middle: Fix = {
			gfx: sheet,
			x: 176,
			y: SHEET_OFF_Y,
			w: TILE_W,
			h: TILE_H,
			renderHeight: TILE_H - BASE_Y,
			alpha: 1,
		};
		if (!await this.pushFix(middle, true)) {
			this.generateErrorImage();
			return;
		}
		
		if (leftEnd) {
			await this.pushFix({
				gfx: sheet,
				x: END_OFF_X + TILE_W * 2,
				y: SHEET_OFF_Y,
				w: TILE_W,
				h: TILE_H,
				alpha: 1,
				scalable: false,
				offsetX: TILE_W / 2,
				ignoreBoundingboxX: true,
			});
			middle.offsetX = TILE_W;
		}
		
		if (rightEnd) {
			await this.pushFix({
				gfx: sheet,
				x: END_OFF_X + TILE_W * 3,
				y: SHEET_OFF_Y,
				w: TILE_W,
				h: TILE_H,
				alpha: 1,
				scalable: false,
				offsetX: width - TILE_W / 2,
				ignoreBoundingboxX: true,
			});
			middle.offsetWidth = TILE_W;
		}
		
		await this.pushWallBody(width, BASE_Y, wallZHeight, frontTint, topTint);
		
		this.entitySettings.bboxYOffset = -1;
		this.updateSettings();
	}
}
