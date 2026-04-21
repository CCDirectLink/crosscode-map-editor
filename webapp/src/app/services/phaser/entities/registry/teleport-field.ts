import { Globals } from '../../../globals';
import { Helper } from '../../helper';
import { TELEPORT_GFX, TeleportGfxObj } from '../teleport-gfx';
import { DefaultEntity } from './default-entity';

export interface TeleportFieldAttributes {
	gfxType?: string;
	map?: string;
	pseudoExit?: boolean;
}

export class TeleportField extends DefaultEntity {
	
	protected override async setupType(settings: TeleportFieldAttributes): Promise<void> {
		const style = Helper.getMapStyle(Globals.map, 'map');
		const tf = style?.teleportField;
		let gfx: TeleportGfxObj | undefined;
		if (settings.gfxType) {
			gfx = TELEPORT_GFX[settings.gfxType];
		}
		if (!gfx) {
			gfx = TELEPORT_GFX['SOLID']!;
		}
		const anims = gfx.gfx(style?.sheet, tf?.xCount, tf?.x, tf?.y);
		const isExit = !!settings.map || !!settings.pseudoExit;
		await this.applyAnims({
			anims,
			animName: isExit ? 'red' : 'active',
			label: 'TeleportField',
			mapStyle: 'map',
			baseSize: { x: 24, y: 24, z: 1 },
		});
	}
	
}
