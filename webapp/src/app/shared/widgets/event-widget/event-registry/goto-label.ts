import {AbstractEvent, EventType} from './abstract-event';


export interface GotoLabelData extends EventType {
	name: string;
}

export class GotoLabel extends AbstractEvent<GotoLabelData> {
	private attributes = {
		name : {
			type: 'String',
			description: 'Label to goto.'
		}
	};
	
	getAttributes() {
		return this.attributes;
	}

	update() {
		this.info = this.combineStrings(
			this.getTypeString('#4254f5'),
			this.getPropString('name')
		);	
	}


	generateNewDataInternal() {
		return {
			name: 'NEW LABEL'
		};
	}
}
