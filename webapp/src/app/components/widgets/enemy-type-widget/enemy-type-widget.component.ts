import { Overlay } from '@angular/cdk/overlay';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { OverlayRefControl } from '../../dialogs/overlay/overlay-ref-control';
import { OverlayService } from '../../dialogs/overlay/overlay.service';
import { AbstractWidget } from '../abstract-widget';
import { EnemyTypeWidgetOverlayComponent } from './enemy-type-overlay/enemy-type-overlay.component';

@Component({
	selector: 'app-enemy-type-widget',
	templateUrl: './enemy-type-widget.component.html',
	styleUrls: ['./enemy-type-widget.component.scss', '../widget.scss']
})
export class EnemyTypeWidgetComponent extends AbstractWidget implements OnInit, OnChanges, OnDestroy {
	private ref?: OverlayRefControl;
	
	private static overlayOpen = false;
	
	constructor(
		private overlayService: OverlayService,
		private overlay: Overlay
	) {
		super();
	}
	
	override ngOnInit() {
		super.ngOnInit();
		if (EnemyTypeWidgetComponent.overlayOpen) {
			this.open();
		}
	}
	
	override ngOnChanges(): void {
		super.ngOnChanges();
		if (!this.settings[this.key] && !this.attribute.optional) {
			this.settings[this.key] = [];
		}
	}
	
	ngOnDestroy() {
		if (this.ref) {
			this.ref.close();
		}
	}
	
	open() {
		EnemyTypeWidgetComponent.overlayOpen = true;
		if (this.ref && this.ref.isOpen()) {
			return;
		}
		const obj = this.overlayService.open(EnemyTypeWidgetOverlayComponent, {
			positionStrategy: this.overlay.position().global()
				.left('330px')
				.top('calc(64px + 6vh / 2)'),
			hasBackdrop: false,
			disablePhaserInput: true
		});
		this.ref = obj.ref;
		
		obj.instance.entity = this.entity;
		obj.instance.key = this.key;
		obj.instance.attribute = this.attribute;
		obj.instance.custom = this.custom;
		
		obj.instance.exit.subscribe(() => {
			this.updateType(this.settings[this.key]);
			this.close();
		});
	}
	
	private close() {
		if (this.ref) {
			this.ref.close();
		}
		EnemyTypeWidgetComponent.overlayOpen = false;
	}
}
