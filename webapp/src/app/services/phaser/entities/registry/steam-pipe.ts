import { Point, Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

interface SteamPipeType {
	gfx: { x: number; y: number; w?: number; h?: number };
	scaleX?: boolean;
	scaleY?: boolean;
	size: Point3;
	renderHeight?: number;
	points: Point[];
}

interface SteamPipeTypes {
	[name: string]: SteamPipeType;
}

export interface SteamPipeAttributes {
	pipeType: string;
}

export class SteamPipe extends DefaultEntity {
	
	protected override async setupType(settings: SteamPipeAttributes): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<SteamPipeTypes>('steam-pipe-types.json');
		
		const attributes = this.getAttributes();
		attributes['pipeType'].options = {};
		for (const name of Object.keys(types)) {
			attributes['pipeType'].options[name] = name;
		}
		
		const type = types[settings.pipeType];
		if (!type) {
			this.generateErrorImage();
			return;
		}
		
		const anims: Anims = {
			sheet: {
				mapStyle: 'pipes',
				width: type.gfx.w ?? 16,
				height: type.gfx.h ?? (type.size.y + (type.renderHeight ?? 0)),
				offX: type.gfx.x,
				offY: type.gfx.y,
			},
			SUB: [{ name: 'default', frames: [0] }],
		};
		
		const scaleSettings = this.getScaleSettings()!;
		scaleSettings.scalableX = !!type.scaleX;
		scaleSettings.scalableY = !!type.scaleY;
		scaleSettings.scalableStep = 16;
		scaleSettings.baseSize = { x: type.size.x, y: type.size.y };
		
		this.snapSizeToScale(scaleSettings);
		
		await this.applyAnims({
			anims,
			animName: 'default',
			label: settings.pipeType,
			mapStyle: 'pipes',
			baseSize: { x: type.size.x, y: type.size.y, z: type.renderHeight ?? 0 },
		});
	}
	
}
