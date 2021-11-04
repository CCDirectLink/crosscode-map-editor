import {Component, OnInit, Input, Output, EventEmitter, ViewChild, DoCheck} from '@angular/core';
import {NPCState} from '../npc-states-widget.component';
import * as settingsJson from '../../../../../assets/npc-settings.json';
import {EventEditorComponent} from '../../event-widget/event-editor/editor/event-editor.component';
import {destructureEventArray, createEventArray, EventArray, EventArrayType} from '../../../../models/events';
import { EventType } from '../../event-widget/event-registry/abstract-event';

@Component({
	selector: 'app-npc-states',
	templateUrl: './npc-states.component.html',
	styleUrls: ['./npc-states.component.scss', '../../widget.scss'],
})
export class NpcStatesComponent implements OnInit, DoCheck {	
	@ViewChild('eventEditor', {static: false}) eventEditor?: EventEditorComponent;
	
	@Input() states: NPCState[] = [];
	@Output() exit: EventEmitter<NPCState[]> = new EventEmitter<NPCState[]>();
	currentState?: NPCState;
	index = 0;
	
	props = settingsJson.default;
	eventTypes = Object.values(EventArrayType);
	warnings: string[] = [];
	private missingTradeEvent = false;
	
	eventType: EventArrayType = EventArrayType.Simple;
	trader?: string;
	
	// TODO: move to global events service
	clipboard = '';
	
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
	
	ngDoCheck() {
		this.warnings.length = 0;
		if (this.isTradeEvent && !this.trader) {
			this.warnings.push('Missing trader name');
		}
		if (this.eventType === EventArrayType.Trade && this.missingTradeEvent) {
			this.warnings.push('START_NPC_TRADE_MENU event is missing, trade popup will not appear');
		}
	}
	
	selectTab(index: number) {
		if (this.currentState) {
			if (!this.eventEditor) {
				throw new Error('event editor is not defined');
			}
			this.currentState.event = createEventArray(this.eventEditor.export(), this.eventType, this.trader);
			this.eventEditor.show();
		}
		this.currentState = this.states[index];
		this.index = index;
		({type: this.eventType, trader: this.trader} = destructureEventArray(this.currentState.event));
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
	
	// TODO: make proper export for copy/paste and export
	copyPage() {
		if (!this.currentState) {
			return;
		}
		if (!this.eventEditor) {
			throw new Error('event editor is not defined');
		}
		this.currentState.event = createEventArray(this.eventEditor.export(), this.eventType, this.trader);
		this.clipboard = JSON.stringify(this.currentState);
		console.log(JSON.parse(this.clipboard));
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
		if (!this.eventEditor) {
			throw new Error('event editor is not defined');
		}
		if (this.currentState) {
			this.currentState.event = createEventArray(this.eventEditor.export(), this.eventType, this.trader);
		}
		const out = this.states;
		out.forEach(state => {
			if (state.position && state.position.active) {
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
	
	updateEventWarnings(updatedEvents: EventType[]) {
		function hasEventOfTypeRecursive(object: any, type: string): boolean {
			if (typeof object !== 'object' || object === null) {
				return false;
			}
			for (const key of Object.keys(object)) {
				if ((key === 'type' && object[key] === type) || hasEventOfTypeRecursive(object[key], type)) {
					return true;
				}
			}
			return false;
		}
		
		this.missingTradeEvent =
			updatedEvents.length > 0 &&
			!hasEventOfTypeRecursive(updatedEvents, 'START_NPC_TRADE_MENU');
	}
	
	get isTradeEvent() {
		return this.eventType === EventArrayType.Trade;
	}
}
