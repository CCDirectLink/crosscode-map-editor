import { Overlay } from '@angular/cdk/overlay';
import { Component, OnChanges } from '@angular/core';
import { OverlayRefControl } from '../../overlay/overlay-ref-control';
import { OverlayService } from '../../overlay/overlay.service';
import { AbstractWidget } from '../abstract-widget';
import { EnemyTypeWidgetOverlayComponent } from './enemy-type-overlay/enemy-type-overlay.component';

@Component({
	selector: 'app-enemy-type-widget',
	templateUrl: './enemy-type-widget.component.html',
	styleUrls: ['./enemy-type-widget.component.scss', '../widget.scss']
})
export class EnemyTypeWidgetComponent extends AbstractWidget implements OnChanges {
	private ref?: OverlayRefControl;
	
	constructor(
		private overlayService: OverlayService,
		private overlay: Overlay
	) {
		super();
	}
	
	ngOnChanges(): void {
		super.ngOnChanges();
		if (!this.settings[this.key] && !this.attribute.optional) {
			this.settings[this.key] = [];
		}
	}
	
	open() {
		if (this.ref && this.ref.isOpen()) {
			return;
		}
		const obj = this.overlayService.open(EnemyTypeWidgetOverlayComponent, {
			positionStrategy: this.overlay.position().global()
				.left('13vw')
				.top('calc(64px + 6vh / 2)'),
			hasBackdrop: true,
			disablePhaserInput: true
		});
		this.ref = obj.ref;

		obj.instance.entity = this.entity;
		obj.instance.key = this.key;
		obj.instance.attribute = this.attribute;

		obj.instance.exit.subscribe(() => this.close());
	}
	
	private close() {
		if (this.ref) {
			this.ref.close();
		}
	}
}
