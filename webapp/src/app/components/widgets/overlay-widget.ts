import { AbstractWidget } from './abstract-widget';
import { Directive, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { OverlayRefControl } from '../dialogs/overlay/overlay-ref-control';
import { OverlayService } from '../dialogs/overlay/overlay.service';
import { Overlay } from '@angular/cdk/overlay';

@Directive()
export abstract class OverlayWidget extends AbstractWidget implements OnInit, OnChanges, OnDestroy {
	private ref?: OverlayRefControl;
	
	constructor(
		protected overlayService: OverlayService,
		protected overlay: Overlay,
	) {
		super();
	}
	
	override ngOnChanges(): void {
		super.ngOnChanges();
		if (!this.settings[this.key] && !this.attribute.optional) {
			this.settings[this.key] = {};
		}
	}
	
	ngOnDestroy() {
		this.ref?.close();
	}
	
	open() {
		if (this.ref?.isOpen()) {
			return;
		}
		this.ref = this.openInternal();
	}
	
	/**
	 * should use overlayService.open
	 */
	abstract openInternal(): OverlayRefControl;
	
	protected close() {
		this.ref?.close();
	}
}
