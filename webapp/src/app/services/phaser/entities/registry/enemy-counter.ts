import { Helper } from '../../helper';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface EnemyCounterAttributes {
	enemyCount?: number;
}

export class EnemyCounter extends DefaultEntity {
	
	protected override async setupType(settings: EnemyCounterAttributes): Promise<void> {
		const count = Helper.clamp(settings.enemyCount ?? 0, 0, 99);
		const tens = Math.floor(count / 10);
		const ones = count % 10;
		
		const anims: Anims = {
			namedSheets: {
				body: { mapStyle: 'puzzle', width: 32, height: 32, offX: 0, offY: 96 },
				digit: { mapStyle: 'puzzle', width: 16, height: 16, offX: 128, offY: 96, xCount: 5 },
			},
			SUB: [
				{ sheet: 'body', SUB: [{ name: 'default', frames: [0] }] },
				{ sheet: 'digit', offset: { x: 1, y: -8 }, aboveZ: 1, SUB: [{ name: 'default', frames: [tens] }] },
				{ sheet: 'digit', offset: { x: 6, y: -3 }, aboveZ: 1, SUB: [{ name: 'default', frames: [ones] }] },
			],
		};
		
		await this.applyAnims({
			anims,
			label: 'EnemyCounter',
			baseSize: { x: 32, y: 30, z: 2 },
		});
	}
	
}
