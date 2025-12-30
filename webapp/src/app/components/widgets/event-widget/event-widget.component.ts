import { Overlay } from '@angular/cdk/overlay';
import { Component, OnChanges, inject } from '@angular/core';

import { OverlayRefControl } from '../../dialogs/overlay/overlay-ref-control';
import { OverlayService } from '../../dialogs/overlay/overlay.service';
import { AbstractWidget } from '../abstract-widget';
import { EventType } from './event-registry/abstract-event';
import { EventWindowComponent } from './event-window/event-window.component';

@Component({
	selector: 'app-event-widget',
	templateUrl: './event-widget.component.html',
	styleUrls: ['./event-widget.component.scss', '../widget.scss'],
	standalone: false
})
export class EventWidgetComponent extends AbstractWidget implements OnChanges {
	private overlayService = inject(OverlayService);
	private overlay = inject(Overlay);

	
	private ref?: OverlayRefControl;
	
	override ngOnChanges(): void {
		super.ngOnChanges();
		if (!this.settings[this.key] && !this.attribute.optional) {
			this.settings[this.key] = [];
		}
	}
	
	open() {
		if (this.ref && this.ref.isOpen()) {
			return;
		}
		const obj = this.overlayService.open(EventWindowComponent, {
			positionStrategy: this.overlay.position().global()
				.left('13vw')
				.top('calc(64px + 6vh / 2)'),
			hasBackdrop: true,
			disablePhaserInput: true
		});
		this.ref = obj.ref;
		
		obj.instance.actionStep = this.attribute.type === 'Action';
		obj.instance.event = this.settings[this.key] || [];
		
		obj.instance.exit.subscribe((v: EventType[]) => {
			this.close();
			this.settings[this.key] = v;
			if (v && v.length === 0 && this.attribute.optional) {
				this.settings[this.key] = undefined;
			}
			this.updateType(this.settings[this.key]);
			
		}, () => this.close());
	}
	
	private close() {
		if (this.ref) {
			this.ref.close();
		}
	}
}
