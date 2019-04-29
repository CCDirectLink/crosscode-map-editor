import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	ChangeDetectionStrategy, 
	OnChanges,
	Renderer2,
	SimpleChange,
	ViewChild,
	AfterViewInit
} from '@angular/core';

import {Subscription} from 'rxjs';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {EventRegistryService} from '../../event-registry/event-registry.service';
import {EventHelperService} from '../event-helper.service';
import {Globals} from '../../../../globals';
import {EventRowComponent} from '../row/event-row.component';
@Component({
	selector: 'app-event-editor',
	templateUrl: './event-editor.component.html',
	styleUrls: ['./event-editor.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default
})
export class EventEditorComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
	@Input() eventData = [];
	@ViewChild(EventRowComponent) rowRef: EventRowComponent;
	workingData: AbstractEvent<any>[];
	focusedElement = [];
	lastFocusedElement = null;
	private shiftDown:boolean = false;
	private clipboard;
	private rendererSubscriptions: Function[] = [];
	private eventSubscriptions : any[] = [];
	private pasteSub : Subscription;
	private selectSub : Subscription;
	
	constructor(private helper: EventHelperService,
				private renderer: Renderer2) {
		console.log("Creating!");
		if (Globals.isElectron) {
			// @ts-ignore
			this.clipboard = window.require('electron').clipboard;
		}
	}
	show() {
		console.log(this.workingData);
	}
	
	ngOnInit(): void {
		console.log("Initializing all listeners");

		this.rendererSubscriptions.push(<Function>this.renderer.listen('window', 'keyup', (event) => {
			if(event.ctrlKey && event.code === "KeyC") {
				this.copy();
			} else if (event.code === "Delete") {
				this.delete();
			}
		}));
		this.rendererSubscriptions.push(<Function>this.renderer.listen('window', 'mousedown', (event) => {
			this.shiftDown = event.shiftKey;
		}));

		this.eventSubscriptions.push(this.helper.pasteEvent.subscribe((event) => {
			if(event) {
				let {data, index} = event;
				this.paste(data, index);
			}
		}));
		this.eventSubscriptions.push(this.helper.copyAndDeleteEvent.subscribe((event) => {
			if(event) {
				this.copy();
				this.delete();
			}
		}));
		this.eventSubscriptions.push(this.helper.selectedEvent.subscribe((component) => {
			if(!component)
				return;
			if(component.force) {
				console.log("Forcing element");
				component = component.value;

				this.lastFocusedElement = null;
			}
			if (component) {

				if(this.lastFocusedElement === null) {
					this.lastFocusedElement = component;
				}
				let focusRange = [];
				if(this.shiftDown) {
					focusRange = this.getFocusRange(component);
				} else {
					this.lastFocusedElement = component;
					focusRange = this.getFocusRange(component);
				}
				// range (Number array) as input
				this.setFocusedRange(component.getParent(), focusRange);
				// TODO: remove event?
				// console.log(v.text);
			}
		}));
	}
	getFocusRange(component) : Number[] {
		let compIndex = component.getComponentIndex();
		if(this.lastFocusedElement === component) {
			return [compIndex];
		}
		let lastFocusedIndex = this.lastFocusedElement.getComponentIndex();
		let arrRange =  Array(Math.abs(compIndex - lastFocusedIndex) + 1)
									   .fill(lastFocusedIndex);
		// Ascending
		if (lastFocusedIndex < compIndex) {
			return arrRange.map((value, index) => value + index);
		} else {
			// Descending
			return arrRange.map((value, index) => value - index);
		}
	}
	ngAfterViewInit() {
		console.log("ChildView initalized", this.rowRef);
	}
	ngOnDestroy() {
		console.log("Destroying.");
		this.focusedElement = [];
		this.rendererSubscriptions.forEach((unsubscribe) => unsubscribe());
		this.eventSubscriptions.forEach((eventSub) => eventSub.unsubscribe());
	}

	copy() {
		let data = this.focusedElement.map((e) => e.copy())
									  .filter((e) => e !== null);
									  
		this.clipboard.writeText(JSON.stringify(data));
		
	}
	delete() {
		let firstElement = this.focusedElement[0];
		if(firstElement) {
			const elementParent = firstElement.getParent();
			elementParent.removeAllComponents(this.focusedElement);
		}
	}
	paste(data, index) {
		if(data) {
			const cpy = JSON.parse(this.clipboard.readText());
			const events = cpy.map((event, index) => {
				event = this.helper.getEventFromType(event);
				if(index === 0) event._pasted = true;
				return event;
			});

			data.splice.apply(data, [index, 0].concat(events));
		}
	}

	setFocusedRange(parent, range) {
		
		let components = parent.getAllComponents();
		this.clearFocusedElements();
		for(let index of range) {
			this.setFocusedElement(components[index], index);
		}
	}
	setFocusedElement(element, insertAt = NaN) {
		let index = this.focusedElement.indexOf(element);
		if(index !== -1) {
			this.focusedElement.splice(index, 1);
		}

		if(!isNaN(insertAt)) {
			this.focusedElement.splice(insertAt, 0, element);
		} else {
			this.focusedElement.push(element);
		}
		
		element.select();
	}

	clearFocusedElements() {
		this.focusedElement.forEach((element) => {
			element.unselect();
		});
		this.focusedElement.splice(0);
	}
	
	ngOnChanges() {
		let cpy = JSON.parse(JSON.stringify(this.eventData));
		if (!cpy.map) {
			// TODO: find out how to properly handle quests
			cpy = cpy.quest;
		}
		if (cpy.map) {
			this.workingData = cpy.map(val => this.helper.getEventFromType(val));
		} else {
			this.workingData = [];
		}
	}
	
	export() {
		if (this.workingData) {
			return this.workingData.map(event => event.export());
		} else {
			return this.eventData;
		}
	}
}
