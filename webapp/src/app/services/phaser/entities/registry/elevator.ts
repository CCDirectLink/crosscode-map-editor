import { Point, Point3 } from '../../../../models/cross-code-map';
import { Globals } from '../../../globals';
import { Anims } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

export interface ElevatorAttributes {
	name?: string;
	condition?: string;
	spawnCondition?: string;
	elevatorType: string;
	destinations?: unknown;
	blockEvent?: unknown;
	blockEventCondition?: string;
	faceDir?: string;
}

interface ElevatorTypes {
	[name: string]: ElevatorType;
}

interface ElevatorType {
	size: Point3;
	ground: ElevatorGround;
	markerDir: string;
	stuckProbility: number;
	speed?: number;
	startDelta?: number;
	noEndRunble?: boolean;
	switchEntry: ElevatorSwitchEntry;
	partyOffset?: Point[];
	posOffset?: Point;
	singlePerson?: boolean;
	closeFrontDoor?: boolean;
}

interface ElevatorGround {
	gfx: string;
	x: number;
	y: number;
	w: number;
	h: number;
	flipX: boolean;
	offset?: Partial<Point3>;
}

interface ElevatorSwitchEntry {
	pos: Point3;
	size: Point3;
	collType?: number;
	anims: Anims;
	showFx?: ElevatorFx;
	hideFx?: ElevatorFx;
}

interface ElevatorFx {
	sheet: string;
	name: string;
}

export class Elevator extends DefaultEntity {

	protected override async setupType(settings: ElevatorAttributes): Promise<void> {
		const types = await Globals.jsonLoader.loadJsonMerged<ElevatorTypes>('elevator-type.json');

		const attributes = this.getAttributes();
		attributes['elevatorType'].options = {};
		for (const name of Object.keys(types)) {
			attributes['elevatorType'].options[name] = name;
		}

		const type = types[settings.elevatorType];
		if (!type) {
			this.generateErrorImage();
			return;
		}

		const groundBranch: Anims = {
			sheet: {
				src: type.ground.gfx,
				width: type.ground.w,
				height: type.ground.h,
				offX: type.ground.x,
				offY: type.ground.y,
			},
			SUB: [{
				frames: [0],
				flipX: type.ground.flipX,
				offset: type.ground.offset,
			}],
		};

		const switchBranch = this.buildSwitchBranch(type.switchEntry, type.size);

		const anims: Anims = {
			SUB: switchBranch ? [groundBranch, switchBranch] : [groundBranch],
		};

		await this.applyAnims({
			anims,
			animName: 'active',
			label: settings.elevatorType,
			baseSize: type.size,
		});
	}

	private buildSwitchBranch(switchEntry: ElevatorSwitchEntry | undefined, baseSize: Point3): Anims | undefined {
		if (!switchEntry) {
			return undefined;
		}
		const switchAnims = switchEntry.anims;
		const base = switchAnims.offset ?? {};
		// pos is measured corner-to-corner (top-left-front). Anim offsets are applied on top of the
		// default bottom-center-of-baseSize anchor, so compensate with the switch's own coll size
		// and the elevator's baseSize to put the sprite where the game puts it.
		return {
			...switchAnims,
			offset: {
				x: (base.x ?? 0) + switchEntry.pos.x + switchEntry.size.x / 2 - baseSize.x / 2,
				y: (base.y ?? 0) + switchEntry.pos.y + switchEntry.size.y - baseSize.y,
				z: (base.z ?? 0) + switchEntry.pos.z,
			},
			aboveZ: 1,
		};
	}

}
