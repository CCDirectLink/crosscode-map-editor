import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import settingsJson from '../../../../../assets/npc-settings.json';
import { createEventArray, destructureEventArray, EventArrayType } from '../../../../models/events';
import { EventEditorComponent } from '../../event-widget/event-editor/editor/event-editor.component';
import { EventType } from '../../event-widget/event-registry/abstract-event';
import { type NPCState } from '../npc-states-widget.component';
import { OverlayPanelComponent } from '../../../dialogs/overlay/overlay-panel/overlay-panel.component';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatButton } from '@angular/material/button';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { KeyValuePipe } from '@angular/common';

@Component({
	selector: 'app-npc-states',
	templateUrl: './npc-states.component.html',
	styleUrls: ['./npc-states.component.scss', '../../widget.scss'],
	imports: [OverlayPanelComponent,
		FlexModule,
		MatButton,
		MatTabGroup,
		MatTab,
		FormsModule,
		MatCheckbox,
		MatIcon,
		EventEditorComponent,
		KeyValuePipe
	]
})
export class NpcStatesComponent implements OnInit {
	@ViewChild('eventEditor', {static: false}) eventEditor?: EventEditorComponent;
	
	@Input() states: NPCState[] = [];
	@Output() exit: EventEmitter<NPCState[]> = new EventEmitter<NPCState[]>();
	currentState?: NPCState;
	index = 0;
	
	props = settingsJson;
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
		if (this.currentState) { //Undefined if this.states.length is 0
			({type: this.eventType, trader: this.trader} = destructureEventArray(this.currentState.event));
		}
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
			face: 'NORTH',
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
	
	updateDisplayedWarnings() {
		this.warnings.length = 0;
		if (this.isTradeEvent) {
			if (!this.trader) {
				this.warnings.push('Missing trader name');
			}
			
			if (this.missingTradeEvent) {
				this.warnings.push('START_NPC_TRADE_MENU event is missing, trade popup will not appear');
			}
		}
	}
	
	updateTradeEventWarning(updatedEvents: EventType[]) {
		function hasEventOfTypeRecursive(object: any, type: string): boolean {
			if (typeof object !== 'object' || object === null) {
				return false;
			}
			for (const [key, value] of Object.entries(object)) {
				if ((key === 'type' && value === type) || hasEventOfTypeRecursive(value, type)) {
					return true;
				}
			}
			return false;
		}
		
		this.missingTradeEvent =
			updatedEvents.length > 0 &&
			!hasEventOfTypeRecursive(updatedEvents, 'START_NPC_TRADE_MENU');
		
		this.updateDisplayedWarnings();
	}
	
	get isTradeEvent() {
		return this.eventType === EventArrayType.Trade;
	}
}
