import {
	Component,
	ComponentFactoryResolver, EventEmitter,
	Input,
	OnDestroy,
	OnInit, Output,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HostDirective} from '../../../../host.directive';
import {CCEntity} from '../../../../phaser/entities/cc-entity';
import {AbstractWidget} from '../../../abstract-widget';
import {WidgetRegistryService} from '../../../widget-registry.service';
import {NPCState} from '../../../npc-states-widget/npc-states-widget.component';
import {JsonWidgetComponent} from '../../../json-widget/json-widget.component';
import {EventHelperService} from '../event-helper.service';
import {EventRegistryService} from '../../event-registry/event-registry.service';

const ANIMATION_TIMING = '300ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
	animations: [
		trigger('slideContent', [
			state('void', style({transform: 'translate(80px, 0)', opacity: 0})),
			state('enter', style({transform: 'translate(0, 0)', opacity: 1})),
			transition('* => *', animate(ANIMATION_TIMING)),
		])
	],
	selector: 'app-event-add',
	templateUrl: './event-add.component.html',
	styleUrls: ['./event-add.component.scss']
})
export class EventAddComponent implements OnInit {
	@Output() getEventClass: EventEmitter<AbstractEvent<any>> = new EventEmitter<any>();
	
	events: string[];
	eventsFiltered: string[];
	animState = 'enter';
	_filterText: string;
	
	constructor(private eventRegistry: EventRegistryService) {
	}
	
	ngOnInit(): void {
		this.events = Object.keys(this.eventRegistry.getAll());
		this.filterText = '';
	}
	
	set filterText(event) {
		if (event === this._filterText) {
			return;
		}
		
		this._filterText = event;
		
		if (!event || !event.trim()) {
			this.eventsFiltered = this.events;
			return;
		}
		
		const searchStr = event.toLowerCase();
		this.eventsFiltered = this.events.filter(text => {
			const compareStr = text.toLowerCase();
			return compareStr.includes(searchStr) || compareStr.replace('_', '').includes(searchStr);
		});
	}
	
	get filterText() {
		return this._filterText;
	}
	
	select(event: string) {
		const clss = this.eventRegistry.getEvent(event);
		const instance: AbstractEvent<any> = new clss({type: event});
		instance.generateNewData();
		instance.update();
		this.getEventClass.emit(instance);
		this.getEventClass.complete();
	}
}
