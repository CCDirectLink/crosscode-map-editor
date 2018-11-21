import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

export interface NPCState {
	reactType: string;
	face: string;
	action: any;
	hidden: boolean;
	position?: {
		x: number;
		y: number;
		lvl: any;
		active?: boolean;
	};
	condition: string;
	config: string;
	event: any;
}

@Component({
	selector: 'app-npcstates-widget',
	templateUrl: './npc-states-widget.component.html',
	styleUrls: ['./npc-states-widget.component.scss', '../widget.scss']
})
export class NPCStatesWidgetComponent extends AbstractWidget implements OnInit, OnChanges {
	
	@Input() custom = null;
	settings: any;
	npcStates: NPCState[];
	
	constructor() {
		super();
	}
	
	ngOnInit() {
		this.ngOnChanges(null);
	}
	
	ngOnChanges(changes: SimpleChanges): void {
		this.settings = this.custom || this.entity.details.settings;
		this.npcStates = this.settings[this.key];
	}
	
	open() {
		console.log('jo');
		console.log(this.npcStates);
	}
}
