import { EntityAttributes } from '../../../phaser/entities/cc-entity';
import {AbstractEvent, EventType} from './abstract-event';

export interface OpenQuestDialogData extends EventType {
	activate: boolean; //No idea what this does, but no quest has it set to true
	quest: string;
	acceptVar: string;
	map: string;
	npc: string;
	accepted: AbstractEvent<any>[];
	declined: AbstractEvent<any>[];
}

export class OpenQuestDialog extends AbstractEvent<OpenQuestDialogData> {
	private attributes: EntityAttributes = {
		quest: {
			type: 'Quest',
			ignoreSubs: true,
			description: 'The quest to open'
		},
		npc: {
			type: 'Character',
			optional: true,
			description: 'Character to use as quest giver, override default and can be used in event triggers.'
		},
		map: {
			type: 'Maps',
			optional: true,
			description: 'Map to show instead of the automated one'
		}
	};
	
	getAttributes(): EntityAttributes {
		return this.attributes;
	}
	
	update() {
		this.children = [];
		this.info = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getPropString('quest'),
			this.getPropString('npc'),
			this.getPropString('map')
		);
		
		this.children[0] = {
			title: this.getColoredString('Quest. Accepted', '#838383'),
			events: this.data.accepted,
			draggable: false
		};
		if (this.data.declined) {
			this.children[1] = {
				title: this.getColoredString('Quest. Declined', '#838383'),
				events: this.data.declined,
				draggable: false
			};
		}
	}
	
	export(): OpenQuestDialogData {
		const out: OpenQuestDialogData = {
			type: this.data.type,
			quest: this.data.quest,
			acceptVar: this.data.acceptVar,
			npc: this.data.npc,
			map: this.data.map,
			activate: false,
			accepted: this.data.accepted.map(v => v.export()),
			declined: this.data.declined?.map(v => v.export())
		};
		return out;
	}
	
	protected generateNewDataInternal() {
		return {
			quest: '',
			npc: undefined,
			map: undefined,
			activate: false //No idea what activate does, but no quest sets it to true
		};
	}
}
