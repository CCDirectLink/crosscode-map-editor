import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';
import { AbstractEvent, EventType } from './abstract-event';

export interface OpenQuestDialogData extends EventType {
	//Attributes
	quest: string;
	npc?: string;
	map?: string;
	
	//Branches
	accepted: AbstractEvent<any>[];
	declined: AbstractEvent<any>[];
	
	//Useless values (declared in map files but never used by game code)
	acceptVar?: string; //Only map that uses a value that is not "tmp.accept" is edge-test, a testing map that the editor doesn't open properly (it uses "tmp.cancel" instead)
	cancelVar?: string; //Only used in edge-test
	activate?: boolean; //Set by quests either to false or undefined
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
		},
	};
	
	getAttributes(): EntityAttributes {
		return this.attributes;
	}
	
	update() {
		this.info = this.combineStrings(
			this.getTypeString('#7ea3ff'),
			this.getPropString('quest'),
			this.getPropString('npc'),
			this.getPropString('map')
		);
		
		this.children = [
			{
				title: this.getColoredString('Quest. Accepted', '#838383'),
				events: this.data.accepted,
				draggable: false
			},
			{
				title: this.getColoredString('Quest. Declined', '#838383'),
				events: this.data.declined,
				draggable: false
			}
		];
	}
	
	override export(): OpenQuestDialogData {
		const out: OpenQuestDialogData = {
			type: this.data.type,
			
			//Attributes
			quest: this.data.quest ?? '',
			npc: this.data.npc,
			map: this.data.map,
			
			//Useless values (they don't do anything but keep them if the original event has them)
			activate: this.data.activate,
			acceptVar: this.data.acceptVar,
			cancelVar: this.data.cancelVar,
			
			//Branches
			accepted: this.data.accepted.map(v => v.export()),
			declined: this.data.declined.map(v => v.export()),
		};
		return out;
	}
	
	protected generateNewDataInternal() {
		return {
			quest: '',
			accepted: [],
			declined: [],
		};
	}
}
