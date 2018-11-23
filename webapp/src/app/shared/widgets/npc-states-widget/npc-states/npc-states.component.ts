import {Component, OnChanges, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NPCState} from '../npc-states-widget.component';
import * as settingsJson from '../../../../../assets/npc-settings.json';
import {Globals} from '../../../globals';

@Component({
	selector: 'app-npc-states',
	templateUrl: './npc-states.component.html',
	styleUrls: ['./npc-states.component.scss', '../../widget.scss'],
})
export class NpcStatesComponent implements OnInit {
	
	@Input() states: NPCState[] = [];
	@Output() exit: EventEmitter<NPCState[]> = new EventEmitter<NPCState[]>();
	currentState: NPCState;
	index = 0;
	
	props = settingsJson.default;
	positionActive = false;
	
	// TODO: move to global events service
	private clipboard;
	
	constructor() {
	}
	
	ngOnInit() {
		this.states.forEach(state => {
			if (!state.position) {
				state.position = {
					x: 0,
					y: 0,
					lvl: 0,
					active: false
				};
			} else if (state.position.active !== false) {
				state.position.active = true;
			}
		});
		this.selectTab(this.index);
	}
	
	selectTab(index: number) {
		this.currentState = this.states[index];
		if (!this.currentState) {
			return;
		}
		this.positionActive = this.currentState.position.active;
		this.index = index;
	}
	
	newPage() {
		this.index++;
		this.states.splice(this.index, 0, {
			reactType: '',
			position: {
				x: 0,
				y: 0,
				lvl: 0,
				active: false
			},
			face: '',
			action: [],
			hidden: false,
			condition: '',
			config: 'normal',
			event: []
		});
	}
	
	copyPage() {
		if (!this.currentState) {
			return;
		}
		
		this.clipboard = JSON.stringify(this.currentState);
	}
	
	pastePage() {
		this.index++;
		this.states.splice(this.index, 0, JSON.parse(this.clipboard));
	}
	
	removePage() {
		this.states.splice(this.index, 1);
		this.index = Math.max(0, this.index - 1);
	}
	
	export() {
		const out = JSON.parse(JSON.stringify(this.states));
		out.forEach(state => {
			if (state.position.active) {
				state.position.active = undefined;
			} else {
				state.position = undefined;
			}
		});
		
		return out;
	}
	
	save() {
		this.exit.emit(this.export());
	}
	
	cancel() {
		this.exit.error('cancel');
	}
}
