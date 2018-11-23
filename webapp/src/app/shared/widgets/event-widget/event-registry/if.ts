import {AbstractEvent, EventType} from './abstract-event';

interface IfData extends EventType {
	withElse: boolean;
	condition: string;
	thenStep: AbstractEvent<any>[];
	elseStep?: AbstractEvent<any>[];
}

export class If extends AbstractEvent<IfData> {
	getAttributes() {
		return {};
	}
	
	update() {
		this.info = this.combineStrings(
			this.getTypeString('#ffffff'),
			this.getPropString('condition')
		);
		this.children[0] = {
			events: this.data.thenStep
		};
		if (this.data.withElse) {
			this.children[1] = {
				title: this.getBoldString('ELSE', '#ffffff'),
				events: this.data.elseStep
			};
		}
		
		console.log('IF', this);
	}
	
}
