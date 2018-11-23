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
	
	updateInfo() {
		this.infos[0] = this.combineStrings(
			this.getTypeString('#ffffff'),
			this.getPropString('condition')
		);
		this.children[0] = this.data.thenStep;
		if (this.data.withElse) {
			this.infos[1] = this.getBoldString('ELSE', '#ffffff');
			this.children[1] = this.data.elseStep;
		}
	}
	
}
