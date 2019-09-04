import {Injectable} from '@angular/core';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {EventRegistryService} from '../../event-registry/event-registry.service';
import events from '../../../../../../assets/events.json';
import {ListSearchOverlayComponent} from '../../../../list-search-overlay/list-search-overlay.component';
import {OverlayRefControl} from '../../../../overlay/overlay-ref-control';
import {OverlayService} from '../../../../overlay/overlay.service';
import {Overlay} from '@angular/cdk/overlay';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class AddEventService {
	private selectedEvent = new Subject<AbstractEvent<any>>();
	
	events: string[];
	
	private ref?: OverlayRefControl;
	
	constructor(
		private eventRegistry: EventRegistryService,
		private overlayService: OverlayService,
		private overlay: Overlay
	) {
		const registry = Object.keys(this.eventRegistry.getAll());
		const eventNames = Object.keys(events);
		
		const eventSet = new Set<string>([...registry, ...eventNames]);
		
		this.events = Array.from(eventSet);
		this.events.sort();
	}
	
	showAddEventMenu(pos: { left: string, top: string }): Observable<AbstractEvent<any>> {
		if (this.ref && this.ref.isOpen()) {
			return this.selectedEvent.asObservable();
		}
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
		
		obj.instance.list = this.events;
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
		const instance: AbstractEvent<any> = new clss({type: event});
		instance.generateNewData();
		instance.update();
		this.selectedEvent.next(instance);
	}
	
	private resetSubject() {
		this.selectedEvent.complete();
		this.selectedEvent = new Subject<AbstractEvent<any>>();
		
	}
}
