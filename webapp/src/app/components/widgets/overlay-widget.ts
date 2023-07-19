import { AbstractWidget } from './abstract-widget';
import { Directive, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { OverlayRefControl } from '../dialogs/overlay/overlay-ref-control';
import { OverlayService } from '../dialogs/overlay/overlay.service';
import { Overlay } from '@angular/cdk/overlay';
import { CCEntity } from '../../services/phaser/entities/cc-entity';

@Directive()
export abstract class OverlayWidget<T = any> extends AbstractWidget<T> implements OnInit, OnChanges, OnDestroy {
	private ref?: OverlayRefControl;
	private static imgCache = new Map<string, string>();
	
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
	
	protected async generateImage<T>(settings: T, entity: CCEntity, offsetY?: number) {
		const imgKey = JSON.stringify(settings);
		let img = OverlayWidget.imgCache.get(imgKey);
		if (img) {
			return img;
		}
		try {
			await entity.setSettings(settings);
		} catch (e) {
			await entity.setSettings({});
		}
		img = (await entity.generateHtmlImage(true, offsetY)).src;
		
		OverlayWidget.imgCache.set(imgKey, img);
		
		return img;
	}
	
	/**
	 * should use overlayService.open
	 */
	abstract openInternal(): Promise<OverlayRefControl>;
	
	protected close() {
		this.ref?.close();
	}
}
