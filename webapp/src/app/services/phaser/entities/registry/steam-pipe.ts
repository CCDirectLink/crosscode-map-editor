import { Point3 } from '../../../../models/cross-code-map';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

interface PipeTypeDef {
	gfxX: number;
	gfxY: number;
	gfxW?: number;
	gfxH?: number;
	scaleX?: boolean;
	scaleY?: boolean;
	size: Point3;
	renderHeight?: number;
}

const PIPE_TYPES: Record<string, PipeTypeDef | undefined> = {
	HORIZONTAL: { gfxX: 32, gfxY: 0, scaleX: true, size: { x: 16, y: 12, z: 5 }, renderHeight: 4 },
	VERTICAL: { gfxX: 32, gfxY: 16, scaleY: true, size: { x: 16, y: 16, z: 5 }, renderHeight: 0 },
	CURVE_SE: { gfxX: 0, gfxY: 0, size: { x: 16, y: 12, z: 5 }, renderHeight: 4 },
	CURVE_SW: { gfxX: 16, gfxY: 0, size: { x: 16, y: 12, z: 5 }, renderHeight: 4 },
	CURVE_NE: { gfxX: 0, gfxY: 16, size: { x: 16, y: 16, z: 5 }, renderHeight: 0 },
	CURVE_NW: { gfxX: 16, gfxY: 16, size: { x: 16, y: 16, z: 5 }, renderHeight: 0 },
	END_NORTH: { gfxX: 48, gfxY: 6, size: { x: 16, y: 16, z: 5 }, renderHeight: 10 },
	OVEN_EAST: { gfxX: 64, gfxY: 0, size: { x: 16, y: 12, z: 32 }, renderHeight: 20 },
	OVEN_WEST: { gfxX: 80, gfxY: 0, size: { x: 16, y: 12, z: 32 }, renderHeight: 20 },
	UPPER_PIPE: { gfxX: 96, gfxY: 0, gfxW: 16, gfxH: 32, scaleX: true, size: { x: 16, y: 12, z: 32 }, renderHeight: 20 },
};

export interface SteamPipeAttributes {
	pipeType: string;
}

export class SteamPipe extends DefaultEntity {
	
	protected override async setupType(settings: SteamPipeAttributes): Promise<void> {
		const type = PIPE_TYPES[settings.pipeType];
		if (!type) {
			this.generateErrorImage();
			return;
		}
		
		const anims: Anims = {
			sheet: {
				mapStyle: 'pipes',
				width: type.gfxW ?? 16,
				height: type.gfxH ?? (type.size.y + (type.renderHeight ?? 0)),
				offX: type.gfxX,
				offY: type.gfxY,
			},
			SUB: [{ name: 'default', frames: [0] }],
		};
		
		const scaleSettings = this.getScaleSettings()!;
		scaleSettings.scalableX = !!type.scaleX;
		scaleSettings.scalableY = !!type.scaleY;
		scaleSettings.scalableStep = 16;
		scaleSettings.baseSize = { x: type.size.x, y: type.size.y };
		
		this.snapSizeToScale(scaleSettings);
		
		const ok = await this.applyAnims(anims, 'default', settings.pipeType, 'pipes');
		if (!ok) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings.baseSize = {
			x: type.size.x, 
			y: type.size.y,
			z: type.renderHeight,
		};
		this.entitySettings.scalableX = scaleSettings.scalableX;
		this.entitySettings.scalableY = scaleSettings.scalableY;
		this.updateSettings();
	}
	
}
