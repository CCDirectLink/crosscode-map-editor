import { AbstractEvent } from './abstract-event';

export class DoAction extends AbstractEvent<any> {
	private attributes = {
		entity: {
			type: 'Entity',
			description: 'Entity to move',
			er: true,
			gh: 'Entity',
		},
		action: {
			type: 'Action',
			description: 'The action to perform',
		},
		repeating: {
			type: 'Boolean',
			description: 'Repeat Action'
		},
		wait: {
			type: 'Boolean',
			description: 'Wait until action is finished'
		},
		keepState: {
			type: 'Boolean',
			description: 'Don\'t reset entity state after action'
		},
		immediately: {
			type: 'Boolean',
			description: 'If true: execute action immediately not interrupting currently running action. Will only execute steps without wait duration.'
		}
	};
	
	getAttributes() {
		return this.attributes;
	}
	
	update() {
		this.info = this.combineStrings(
			this.getTypeString('#8fe174'),
			this.getPropString('entity'),
			this.getPropString('actions', '[' + this.data.action.length + ']'),
			this.getPropString('repeating'),
			this.getPropString('wait'),
			this.getPropString('keepState'),
			this.getPropString('immediately')
		);
	}
	
	protected generateNewDataInternal() {
		return {
			entity: {},
			action: [],
		};
	}
}
