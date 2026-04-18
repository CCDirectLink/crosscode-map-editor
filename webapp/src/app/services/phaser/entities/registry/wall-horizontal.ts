import { WallColors } from '../../../../models/map-styles';
import { Globals } from '../../../globals';
import { Helper } from '../../helper';
import { Fix } from '../cc-entity';
import { DefaultEntity } from './default-entity';

export interface WallHorizontalAttributes {
	skipRender?: boolean;
	leftEnd?: string;
	rightEnd?: string;
	collType?: string;
	wallZHeight?: number;
}

const TILE_W = 8;
const TILE_H = 9;
const BASE_Y = 8;
const SHEET_OFF_X = 176;
const SHEET_OFF_Y = 64;

const EFFECT_SHEET = 'media/entity/objects/object-effects.png';
const EFFECT_TILE_X = 176;
const EFFECT_TILE_Y = 0;
const EFFECT_TILE = 16;

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

export class WallHorizontal extends DefaultEntity {

	protected override async setupType(settings: WallHorizontalAttributes): Promise<void> {
		if (settings.skipRender) {
			this.generateNoImageType();
			return;
		}

		const puzzleStyle = Helper.getMapStyle(Globals.map, 'puzzle');
		const wallsStyle = Helper.getMapStyle(Globals.map, 'walls');
		const sheet = puzzleStyle?.sheet;
		const colors = wallsStyle?.colors;
		if (!sheet || !colors) {
			this.generateErrorImage();
			return;
		}

		const collType: CollType = (settings.collType as CollType) ?? 'BLOCK';
		const colorKeys = COLL_COLORS[collType] ?? COLL_COLORS.BLOCK;
		const frontHex = colors[colorKeys.front];
		const topHex = colors[colorKeys.top];

		const wallZHeight = settings.wallZHeight ?? 32;
		const leftEnd = settings.leftEnd && settings.leftEnd !== 'CONTINUE';
		const rightEnd = settings.rightEnd && settings.rightEnd !== 'CONTINUE';

		const size = this.details.settings['size'] as { x: number; y: number } | undefined;
		const width = size?.x ?? TILE_W;

		const middle: Fix = {
			gfx: sheet,
			x: SHEET_OFF_X,
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
			const leftFix: Fix = {
				gfx: sheet,
				x: SHEET_OFF_X + TILE_W * 2,
				y: SHEET_OFF_Y,
				w: TILE_W,
				h: TILE_H,
				alpha: 1,
				scalable: false,
				offsetX: TILE_W / 2,
				ignoreBoundingboxX: true,
			};
			await this.pushFix(leftFix);
			middle.offsetX = TILE_W;
		}

		if (rightEnd) {
			const rightFix: Fix = {
				gfx: sheet,
				x: SHEET_OFF_X + TILE_W * 3,
				y: SHEET_OFF_Y,
				w: TILE_W,
				h: TILE_H,
				alpha: 1,
				scalable: false,
				offsetX: width - TILE_W / 2,
				ignoreBoundingboxX: true,
			};
			await this.pushFix(rightFix);
			middle.offsetWidth = TILE_W;
		}

		// Front face of the wall block (y = -wallZHeight .. 0)
		await this.pushFix({
			gfx: 'pixel',
			x: 0,
			y: 0,
			w: width,
			h: wallZHeight,
			scaleX: width,
			scaleY: wallZHeight,
			tint: hexToNumber(frontHex),
			alpha: WALL_ALPHA,
			scalable: false,
			offsetX: width / 2,
			offsetY: -1,
			ignoreBoundingboxX: true,
		});

		// Top face (y = -wallZHeight ... -wallZHeight + BASE_Y)
		await this.pushFix({
			gfx: 'pixel',
			x: 0,
			y: 0,
			w: width,
			h: BASE_Y,
			scaleX: width,
			scaleY: BASE_Y,
			tint: hexToNumber(topHex),
			alpha: WALL_ALPHA,
			scalable: false,
			offsetX: width / 2,
			offsetY: -wallZHeight - 1,
			ignoreBoundingboxX: true,
		});

		// Effect pattern overlay covering the wall front face
		await this.pushFix({
			gfx: EFFECT_SHEET,
			x: EFFECT_TILE_X,
			y: EFFECT_TILE_Y,
			w: EFFECT_TILE,
			h: EFFECT_TILE,
			alpha: WALL_ALPHA,
			renderMode: 'lighter',
			renderHeight: wallZHeight + 1,
			offsetY: 1,
		});

		this.entitySettings.bboxYOffset = -1;
		this.updateSettings();
	}
}
