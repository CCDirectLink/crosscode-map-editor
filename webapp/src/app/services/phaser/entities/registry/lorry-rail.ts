import { Globals } from '../../../globals';
import { Helper } from '../../helper';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

interface LorryRailType {
	gfx: { x: number; y: number; w?: number };
	scaleX?: boolean;
	scaleY?: boolean;
}

type LorryRailTypes = Record<string, LorryRailType | undefined>;

export interface LorryRailAttributes {
	railType: string;
}

export class LorryRail extends DefaultEntity {
	
	protected override async setupType(settings: LorryRailAttributes): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<LorryRailTypes>('lorry-rail-types.json');
		const type = types[settings.railType];
		if (!type) {
			this.generateErrorImage();
			return;
		}
		
		const scalable = !!(type.scaleX || type.scaleY);
		const width = scalable ? 16 : (type.gfx.w ?? 16);
		const height = 16;
		
		const style = Helper.getMapStyle(Globals.map, 'lorry');
		const anims: Anims = {
			sheet: {
				src: style?.sheet,
				width,
				height,
				offX: (style?.railX ?? 0) + type.gfx.x,
				offY: (style?.railY ?? 0) + type.gfx.y,
			},
		};
		
		const scaleSettings = this.getScaleSettings()!;
		scaleSettings.scalableX = !!type.scaleX;
		scaleSettings.scalableY = !!type.scaleY;
		scaleSettings.scalableStep = 16;
		scaleSettings.baseSize = { x: width, y: height };
		
		this.snapSizeToScale(scaleSettings);
		
		await this.applyAnims({
			anims,
			label: settings.railType,
			baseSize: { x: width, y: height, z: 0 },
		});
	}
	
}
