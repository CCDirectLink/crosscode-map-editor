import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {EventRegistryService} from '../../event-registry/event-registry.service';
import events from '../../../../../../assets/events.json';

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
export class EventAddComponent implements OnInit, AfterViewInit {
	@ViewChild('filterInput', {static: true}) filterInput!: ElementRef;
	
	@Output() getEventClass: EventEmitter<AbstractEvent<any>> = new EventEmitter<any>();
	
	events: string[];
	eventsFiltered: string[] = [];
	animState = 'enter';
	_filterText?: string;
	
	constructor(private eventRegistry: EventRegistryService) {
		
		const registry = Object.keys(this.eventRegistry.getAll());
		const eventNames = Object.keys(events);
		
		const eventSet = new Set<string>([...registry, ...eventNames]);
		
		this.events = Array.from(eventSet);
		this.events.sort();
		this.filterText = '';
	}
	
	ngOnInit(): void {
		this.filterInput.nativeElement.focus();
	}
	
	ngAfterViewInit(): void {
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
		event = event.trim();
		
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
