import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';
import { AbstractEvent, EventType } from './abstract-event';

export interface StartNpcTradeMenuData extends EventType {
	withBranches?: boolean;

	//Branches
	traded?: AbstractEvent<any>[];
	canceled?: AbstractEvent<any>[];
}

export class StartNpcTradeMenu extends AbstractEvent<StartNpcTradeMenuData> {
	private attributes: EntityAttributes = {
		withBranches: {
			type: 'Boolean',
			optional: true,
			description: 'Whether or not this trade has event branches',
			C1: true,
			C2: true,
		},
	};

	getAttributes(): EntityAttributes {
		return this.attributes;
	}

	update() {
		this.children.length = 0;
		this.info = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getPropString('withBranches'),
		);

		if (this.data.withBranches) {
			this.children[0] = {
				title: this.getColoredString('Trade. Traded', '#838383'),
				events: this.data.traded ?? [],
				draggable: false,
			};
			this.children[1] = {
				title: this.getColoredString('Trade. Canceled', '#838383'),
				events: this.data.canceled ?? [],
				draggable: false,
			};
		}
	}

	override export(): StartNpcTradeMenuData {
		const out: StartNpcTradeMenuData = {
			type: this.data.type,
			withBranches: this.data.withBranches,
		};
		if (this.data.withBranches) {
			out.traded = (this.data.traded ?? []).map((v) => v.export());
			out.canceled = (this.data.canceled ?? []).map((v) => v.export());
		}
		return out;
	}

	protected generateNewDataInternal() {
		return {
			withBranches: false,
		};
	}
}
