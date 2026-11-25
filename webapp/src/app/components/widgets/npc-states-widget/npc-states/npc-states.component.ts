import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { createEventArray, destructureEventArray, EventArrayType } from '../../../../models/events';
import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';
import { OverlayPanelComponent } from '../../../dialogs/overlay/overlay-panel/overlay-panel.component';
import { BooleanWidgetComponent } from '../../boolean-widget/boolean-widget.component';
import { EventEditorComponent } from '../../event-widget/event-editor/editor/event-editor.component';
import { EventType } from '../../event-widget/event-registry/abstract-event';
import { EventWidgetComponent } from '../../event-widget/event-widget.component';
import { JsonWidgetComponent } from '../../json-widget/json-widget.component';
import { StringWidgetComponent } from '../../string-widget/string-widget.component';
import { type NPCState } from '../npc-states-widget.component';

@Component({
	selector: 'app-npc-states',
	templateUrl: './npc-states.component.html',
	styleUrls: ['./npc-states.component.scss', '../../widget.scss'],
	imports: [
		OverlayPanelComponent,
		MatButton,
		MatTabGroup,
		MatTab,
		FormsModule,
		MatCheckbox,
		MatIcon,
		EventEditorComponent,
		EventWidgetComponent,
		JsonWidgetComponent,
		StringWidgetComponent,
		BooleanWidgetComponent,
	]
})
export class NpcStatesComponent implements OnInit {
	@ViewChild('eventEditor', {static: false}) eventEditor?: EventEditorComponent;
	
	@Input() states: NPCState[] = [];
	@Output() exit: EventEmitter<NPCState[]> = new EventEmitter<NPCState[]>();
	protected currentState?: NPCState;
	protected index = 0;
	
	protected warnings: string[] = [];
	private missingTradeEvent = false;
	
	// Used by app-string-widget
	eventType: EventArrayType = EventArrayType.Simple;
	// Used by app-string-widget
	trader?: string;
	
	// TODO: move to global events service
	protected clipboard = '';
	
	protected readonly attributes = {
		condition: {
			type: 'VarCondition',
			description: 'Condition for this page to be active',
			height: 24
		},
		position: {
			type: 'Vec3',
			description: 'Position of NPC for this page',
			pointSelect: true,
			optional: true
		},
		reactType: {
			type: 'String',
			description: 'How NPC will react on touches and talking',
			float: true,
			options: {
				PUSHABLE: 0,
				FIXED_POS: 1,
				FIXED_FACE: 2
			},
			default: 'FIXED_POS'
		},
		face: {
			type: 'Face',
			description: 'Face direction.',
			float: true,
			options: {
				NORTH: 0,
				EAST: 1,
				SOUTH: 2,
				WEST: 3,
				NORTH_EAST: 4,
				SOUTH_EAST: 5,
				SOUTH_WEST: 6,
				NORTH_WEST: 7
			}
		},
		config: {
			type: 'CharConfig',
			description: 'Configuration of Charater for this page',
			float: true,
			options: {
				'normal': 0,
				'run': 0,
				'ground': 0,
				'groundFloat': 0,
				'offline': 0,
				'sit': 0,
				'sitFloat': 0,
				'sit2': 0,
				'sit2Float': 0
			}
		},
		action: {
			type: 'Action',
			description: 'Action to perform constantly',
			popup: true,
			float: true,
			clear: true,
			optional: true
		},
		showFx: {
			type: 'Effect',
			description: 'Action to perform constantly',
			popup: true,
			float: true,
			optional: true
		},
		hideFx: {
			type: 'Effect',
			description: 'Action to perform constantly',
			popup: true,
			float: true,
			optional: true
		},
		permaFx: {
			type: 'Effect',
			description: 'Action to perform constantly',
			popup: true,
			float: true,
			optional: true
		},
		hidden: {
			type: 'Boolean',
			description: 'If true: NPC is hidden.',
			float: true,
			clear: true
		},
		door: {
			type: 'Entity',
			description: 'Door that NPC should enter from/leave to (only specify when hidden!)',
			optional: true,
			float: true
		},
		eventType: {
			type: 'String',
			description: 'Type of npc event. e.g. simple event or trade.',
			options: {
				simple: 'simple',
				quest: 'quest',
				shop: 'shop',
				arena: 'arena',
				trade: 'trade'
			}
		}
	} satisfies EntityAttributes;
	
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
	
	protected selectTab(index: number) {
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
	
	protected newPage() {
		this.index++;
		this.states.splice(this.index, 0, {
			reactType: 'FIXED_POS',
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
	protected copyPage() {
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
	
	protected pastePage() {
		this.index++;
		this.states.splice(this.index, 0, JSON.parse(this.clipboard));
	}
	
	protected removePage() {
		this.states.splice(this.index, 1);
		this.index = Math.max(0, this.index - 1);
	}
	
	private export() {
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
	
	protected save() {
		this.exit.emit(this.export());
	}
	
	protected cancel() {
		this.exit.error('cancel');
	}
	
	private updateDisplayedWarnings() {
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
	
	protected updateTradeEventWarning(updatedEvents: EventType[]) {
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
	
	protected get isTradeEvent() {
		return this.eventType === EventArrayType.Trade;
	}
}
