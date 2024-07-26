import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';

import { ListSearchOverlayComponent } from '../../../../dialogs/list-search-overlay/list-search-overlay.component';
import { OverlayRefControl } from '../../../../dialogs/overlay/overlay-ref-control';
import { OverlayService } from '../../../../dialogs/overlay/overlay.service';
import { AbstractEvent } from '../../event-registry/abstract-event';
import { EventRegistryService } from '../../event-registry/event-registry.service';
import { JsonLoaderService } from '../../../../../services/json-loader.service';
import { ActionsJson, EventsJson } from '../../event-registry/default-event';

@Injectable({
	providedIn: 'root'
})
export class AddEventService {
	private selectedEvent = new Subject<AbstractEvent<any>>();
	private actionStep = false;
	
	events: string[] = [];
	actions: string[] = [];
	
	private ref?: OverlayRefControl;
	
	constructor(
		private eventRegistry: EventRegistryService,
		private overlayService: OverlayService,
		private overlay: Overlay,
		private domSanitizer: DomSanitizer,
		private jsonLoader: JsonLoaderService,
	) {
		this.init();
	}
	
	private async init() {
		const events = await this.jsonLoader.loadJsonMerged<EventsJson>('events.json');
		const actions = await this.jsonLoader.loadJsonMerged<ActionsJson>('actions.json');
		
		const eventNames = Object.keys(events);
		const registry = Object.keys(this.eventRegistry.getAll());
		const eventSet = new Set<string>([...registry, ...eventNames]);
		
		this.events = Array.from(eventSet);
		this.events.sort();
		
		this.actions = Object.keys(actions);
		this.actions.sort();
	}
	
	showAddEventMenu(pos: { left: string, top: string }, actionStep: boolean): Observable<AbstractEvent<any>> {
		if (this.ref && this.ref.isOpen()) {
			return this.selectedEvent.asObservable();
		}
		this.actionStep = actionStep;
		const obj = this.overlayService.open(ListSearchOverlayComponent, {
			positionStrategy: this.overlay.position().global()
				.left(pos.left)
				.top(pos.top),
			height: '90vh',
			backdropClickClose: true,
			hasBackdrop: true,
		});
		this.ref = obj.ref;
		this.ref.onClose.subscribe(() => this.resetSubject());
		
		obj.instance.list = actionStep ? this.actions : this.events;
		obj.instance.animation = 'slide';
		obj.instance.selected.subscribe((v: string) => {
			this.select(v);
			this.close();
		}, () => this.close());
		
		return this.selectedEvent.asObservable();
	}
	
	private close() {
		if (this.ref) {
			this.ref.close();
		}
	}
	
	select(event: string) {
		const clss = this.eventRegistry.getEvent(event);
		const instance: AbstractEvent<any> = new clss(this.domSanitizer, {type: event}, this.actionStep, this.jsonLoader);
		instance.generateNewData();
		instance.update();
		this.selectedEvent.next(instance);
	}
	
	private resetSubject() {
		this.selectedEvent.complete();
		this.selectedEvent = new Subject<AbstractEvent<any>>();
		
	}
}
