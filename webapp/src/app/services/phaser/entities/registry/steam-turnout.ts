import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

const TURNOUT_TILES: Record<string, number | undefined> = {
	HORIZONTAL: 2,
	VERTICAL: 5,
	CURVE_SE: 0,
	CURVE_SW: 1,
	CURVE_NE: 3,
	CURVE_NW: 4,
};

export interface SteamTurnoutAttributes {
	turnDefault: string;
	turnAlt: string;
	condition?: unknown;
}

export class SteamTurnout extends DefaultEntity {

	protected override async setupType(settings: SteamTurnoutAttributes): Promise<void> {
		const defaultTile = TURNOUT_TILES[settings.turnDefault];
		const altTile = TURNOUT_TILES[settings.turnAlt];
		if (defaultTile === undefined || altTile === undefined) {
			this.generateErrorImage();
			return;
		}

		const anims: Anims = {
			sheet: {
				mapStyle: 'pipes',
				width: 16,
				height: 24,
				xCount: 3,
				offY: 64,
			},
			wallY: 1,
			SUB: [
				{ name: 'off', frames: [defaultTile] },
				{ name: 'on', frames: [altTile] },
			],
		};

		const ok = await this.applyAnims(anims, 'off', settings.turnDefault, 'pipes');
		if (!ok) {
			this.generateErrorImage();
			return;
		}

		this.entitySettings.baseSize = { x: 16, y: 16, z: 10 };
		this.updateSettings();
	}

}
