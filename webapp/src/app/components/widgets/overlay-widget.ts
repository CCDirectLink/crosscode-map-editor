import { Overlay } from '@angular/cdk/overlay';
import { Directive, inject, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Globals } from '../../services/globals';
import { CCEntity } from '../../services/phaser/entities/cc-entity';
import { OverlayRefControl } from '../dialogs/overlay/overlay-ref-control';
import { OverlayService } from '../dialogs/overlay/overlay.service';
import { AbstractWidget } from './abstract-widget';

@Directive()
export abstract class OverlayWidget<T = Record<string, any>>
	extends AbstractWidget<T>
	implements OnInit, OnChanges, OnDestroy
{
	private ref?: OverlayRefControl;
	private static imgCache = new Map<string, string>();

	protected overlayService = inject(OverlayService);
	protected overlay = inject(Overlay);

	ngOnDestroy() {
		this.ref?.close();
	}

	async open() {
		if (this.ref?.isOpen()) {
			return;
		}
		this.ref = await this.openInternal();
	}

	protected async generateImage<T>(
		settings: T,
		entity: string | CCEntity,
		offsetY?: number,
		entityScale = 1,
	) {
		const imgKey = JSON.stringify(settings);
		let img = OverlayWidget.imgCache.get(imgKey);
		if (img) {
			return img;
		}

		if (typeof entity === 'string') {
			const entityClass = Globals.entityRegistry.getEntity(entity);
			entity = new entityClass(
				Globals.scene,
				Globals.map,
				-999999,
				0,
				entity,
			);
		}

		try {
			await entity.setSettings(settings);
		} catch (e) {
			await entity.setSettings({});
		}
		img = (await entity.generateHtmlImage(true, offsetY, entityScale)).src;

		OverlayWidget.imgCache.set(imgKey, img);

		entity.destroy();

		return img;
	}

	/**
	 * should use overlayService.open
	 */
	abstract openInternal(): Promise<OverlayRefControl>;

	protected close() {
		this.onChange.emit();
		this.ref?.close();
	}
}
