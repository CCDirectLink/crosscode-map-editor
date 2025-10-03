import { AbstractEvent } from './abstract-event';
import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';

export class SetPlayerCore extends AbstractEvent<any> {
	private attributes: EntityAttributes = {
		core: {
			type: 'String',
			description: 'Type of Core.',
			options: {
				MOVE: 1,
				CHARGE: 2,
				DASH: 3,
				CLOSE_COMBAT: 4,
				GUARD: 5,
				CREDITS: 6,
				MENU: 7,
				ELEMENT_NEUTRAL: 8,
				ELEMENT_HEAT: 9,
				ELEMENT_COLD: 10,
				ELEMENT_SHOCK: 11,
				ELEMENT_WAVE: 12,
				QUICK_MENU: 13,
				THROWING: 14,
				ELEMENT_LOAD: 15,
				ELEMENT_CHANGE: 16,
				SPECIAL: 17,
				COMBAT_RANK: 18,
				QUEST_SWITCH: 19,
				EXP: 20,
				MENU_CIRCUIT: 21,
				MENU_SYNOPSIS: 22,
				MENU_SOCIAL: 23,
				MENU_SOCIAL_INVITE: 24,
				MENU_BOTANICS: 25,
				ITEMS: 26,
				MONEY: 27,
				MODIFIER: 28,
			},
		},
		value: {
			type: 'Boolean',
			description: 'True to activate core.',
		},
	};

	getAttributes() {
		return this.attributes;
	}

	update() {
		this.info = this.combineStrings(
			this.getTypeString('#8fe174'),
			this.getPropString('core'),
			this.getPropString('value'),
		);
	}

	protected generateNewDataInternal() {
		return {
			core: 'MOVE',
			value: true,
		};
	}
}
