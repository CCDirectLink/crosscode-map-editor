import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

interface ChestTypeDef {
	anim: string;
}

const CHEST_TYPES: Record<string, ChestTypeDef | undefined> = {
	Default: { anim: 'idle' },
	Bronze: { anim: 'idleBronze' },
	Silver: { anim: 'idleSilver' },
	Gold: { anim: 'idleGold' },
	Key: { anim: 'idleKey' },
	MasterKey: { anim: 'idleMasterKey' },
};

export interface ChestAttributes {
	chestType?: string;
	item?: number;
	amount?: number;
}

export class Chest extends DefaultEntity {

	protected override async setupType(settings: ChestAttributes): Promise<void> {
		const type = CHEST_TYPES[settings.chestType!] ?? CHEST_TYPES['Default']!;

		const anims: Anims = {
			offset: { x: 0.5, y: 0, z: 6 },
			shadow: { size: 16 },
			SUB: [{
				sheet: { src: 'media/entity/objects/treasure.png', width: 16, height: 24 },
				frames: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5],
				SUB: [
					{ name: 'idle' },
					{ name: 'idleBronze' },
					{ name: 'idleSilver' },
					{ name: 'idleGold' },
					{ name: 'idleKey' },
					{ name: 'idleMasterKey' },
				],
			}, {
				sheet: { src: 'media/entity/objects/treasure.png', width: 24, height: 24, offY: 56 },
				SUB: [
					{ name: 'idleBronze', frames: [3] },
					{ name: 'idleSilver', frames: [2] },
					{ name: 'idleGold', frames: [0] },
					{ name: 'idleKey', frames: [4] },
					{ name: 'idleMasterKey', frames: [5] },
				],
			}],
		};

		await this.applyAnims(anims, type.anim, 'Chest', undefined, { x: 17, y: 13, z: 12 });
	}

}
