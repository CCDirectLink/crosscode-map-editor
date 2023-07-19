import { AbstractWidget } from './abstract-widget';
import { Directive, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { OverlayRefControl } from '../dialogs/overlay/overlay-ref-control';
import { OverlayService } from '../dialogs/overlay/overlay.service';
import { Overlay } from '@angular/cdk/overlay';

@Directive()
export abstract class OverlayWidget<T = any> extends AbstractWidget<T> implements OnInit, OnChanges, OnDestroy {
	private ref?: OverlayRefControl;
	
	constructor(
		protected overlayService: OverlayService,
		protected overlay: Overlay,
	) {
		super();
	}
	
	override ngOnChanges(): void {
		super.ngOnChanges();
		if (!this.settings[this.key as keyof T] && !this.attribute.optional) {
			this.settings[this.key as keyof T] = {} as any;
		}
	}
	
	ngOnDestroy() {
		this.ref?.close();
	}
	
	async open() {
		if (this.ref?.isOpen()) {
			return;
		}
		this.ref = await this.openInternal();
	}
	
	/**
	 * should use overlayService.open
	 */
	abstract openInternal(): Promise<OverlayRefControl>;
	
	protected close() {
		this.ref?.close();
	}
}
