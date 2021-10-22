import { EntityAttributes } from '../../../phaser/entities/cc-entity';
import {AbstractEvent, EventType} from './abstract-event';

export interface OpenQuestDialogData extends EventType {
	//Attributes
	quest: string;
	npc: string;
	map: string;
	
	//Mistery values
	acceptVar?: string; //Only map that uses a value that is not "tmp.accept" is edge-test, a testing map that the editor doesn't open properly (it uses "tmp.cancel" instead)
	cancelVar?: string; //Only used in edge-test
	activate: boolean; //No idea what this does, but no quest has it set to true, poking with it makes no difference either
	
	//Branches
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
		},
		acceptVar: {
			type: 'String',
			optional: true,
			description: 'Typically set by quests to either blank or "tmp.accept"'
		}
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
	
	export(): OpenQuestDialogData {
		const out: OpenQuestDialogData = {
			type: this.data.type,
			quest: this.data.quest,
			npc: this.data.npc,
			map: this.data.map,
			acceptVar: this.data.acceptVar,
			cancelVar: this.data.cancelVar,
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
			
			acceptVar: 'tmp.accept',
			cancelVar: undefined,
			activate: false, //No idea what activate does, but no quest sets it to true
			
			accepted: [],
			declined: [],
		};
	}
}
