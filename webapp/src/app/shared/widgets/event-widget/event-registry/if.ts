import {AbstractEvent, EventType} from './abstract-event';

interface IfData extends EventType {
	withElse: boolean;
	condition: string;
	thenStep: AbstractEvent<any>[];
	elseStep?: AbstractEvent<any>[];
}

export class If extends AbstractEvent<IfData> {
	private attributes = {
		condition: {
			type: 'VarCondition',
			description: 'Condition for IF statement'
		},
		withElse: {
			type: 'Boolean',
			description: 'With else case.',
			C2: true
		}
	};
	
	getAttributes() {
		return this.attributes;
	}
	
	update() {
		this.children = [];
		this.info = this.combineStrings(
			this.getTypeString('#ffffff'),
			this.getPropString('condition')
		);
		this.children[0] = {
			events: this.data.thenStep || []
		};
		if (this.data.withElse) {
			this.children[1] = {
				title: this.getBoldString('ELSE', '#ffffff'),
				events: this.data.elseStep || []
			};
		}
	}
	
	export(): IfData {
		const out: IfData = {
			type: this.data.type,
			withElse: this.data.withElse,
			condition: this.data.condition,
			thenStep: this.children[0].events.map(v => v.export())
		};
		if (out.withElse) {
			out.elseStep = this.children[1].events.map(v => v.export());
		}
		return out;
	}
	
	protected generateNewDataInternal() {
		return {
			condition: ''
		};
	}
}
