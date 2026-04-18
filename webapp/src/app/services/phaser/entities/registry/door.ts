import { Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { Helper } from '../../helper';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

type Dir = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export interface DoorAttributes {
	doorType?: string;
	dir?: Dir;
	variation?: string;
}

interface DoorTypeDef {
	size: Point3;
	anims: Anims;
}

type DoorTypes = Record<string, DoorTypeDef | undefined>;

export class Door extends DefaultEntity {
	
	protected override async setupType(settings: DoorAttributes): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<DoorTypes>('door-types.json');
		const type = settings.doorType ? types[settings.doorType] : undefined;
		
		if (type) {
			const ok = await this.applyAnims(type.anims, 'idle', `Door ${settings.doorType}`);
			if (!ok) {
				this.generateErrorImage();
				return;
			}
			this.entitySettings.baseSize = type.size;
			this.updateSettings();
			return;
		}
		
		await this.setupDefault(settings);
	}
	
	private async setupDefault(settings: DoorAttributes): Promise<void> {
		const dir: Dir = settings.dir ?? 'SOUTH';
		const sideways = dir === 'EAST' || dir === 'WEST';
		const style = Helper.getMapStyle(Globals.map, 'map');
		const variation = settings.variation ? style?.doorVariations?.[settings.variation] : undefined;
		const offX = variation?.x ?? 0;
		const offY = variation?.y ?? 0;
		
		let anims: Anims;
		if (sideways) {
			anims = {
				offset: { x: dir === 'WEST' ? -8 : 8, y: 0, z: 0 },
				namedSheets: {
					door: { mapStyle: 'map', width: 16, height: 96, xCount: 1, offX: offX + 128, offY },
				},
				sheet: 'door',
				flipX: dir === 'EAST',
				SUB: [{ name: 'idle', frames: [0] }],
			};
		} else {
			anims = {
				offset: { x: 0, y: dir === 'NORTH' ? -15 : 0, z: 0 },
				namedSheets: {
					door: { mapStyle: 'map', width: 32, height: 48, xCount: 4, offX, offY },
				},
				sheet: 'door',
				tileOffset: dir === 'NORTH' ? 4 : 0,
				framesAlpha: dir === 'NORTH' ? [0.8] : undefined,
				SUB: [{ name: 'idle', frames: [0] }],
			};
		}
		
		const hasDoorMat = variation?.doorMat ?? style?.hasDoorMat;
		if (hasDoorMat) {
			anims.namedSheets!['mat'] = { mapStyle: 'map', width: 32, height: 32, xCount: 5, offY: 96 };
			let matOffsetX = 0;
			let matOffsetY = 0;
			if (dir === 'SOUTH') {
				matOffsetY = 16;
			}
			if (dir === 'EAST') {
				matOffsetX = 8;
			}
			if (dir === 'WEST') {
				matOffsetX = -8;
			}
			(anims.SUB as Anims[]).push({
				sheet: 'mat',
				tileOffset: sideways ? 0 : 5,
				flipX: dir === 'EAST',
				flipY: dir === 'NORTH',
				offset: { x: matOffsetX, y: matOffsetY, z: 0 },
				aboveZ: -1,
				SUB: [{ name: 'idle', frames: [0] }],
			});
		}
		
		const ok = await this.applyAnims(anims, 'idle', 'Door', 'map');
		if (!ok) {
			this.generateErrorImage();
			return;
		}
		
		this.entitySettings.baseSize = sideways
			? { x: 16, y: 32, z: 48 }
			: { x: 32, y: 16, z: 48 };
		this.updateSettings();
	}
	
}
