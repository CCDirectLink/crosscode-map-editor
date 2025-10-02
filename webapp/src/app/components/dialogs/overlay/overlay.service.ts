import { ComponentType, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { Globals } from '../../../services/globals';
import { OverlayRefControl } from './overlay-ref-control';

interface CustomOverlayConfig extends OverlayConfig {
	backdropClickClose?: boolean;
	disablePhaserInput?: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class OverlayService {
	
	private static disablePhaserInputKey = 0;
	
	constructor(
		private injector: Injector,
		private overlay: Overlay) {
	}
	
	open<T>(component: ComponentType<T>, options: CustomOverlayConfig = {}): { ref: OverlayRefControl<any>, instance: T } {
		const config = this.getOverlayConfig(options);
		const ref = this.overlay.create(config);
		const refControl = new OverlayRefControl(ref);
		const portal = new ComponentPortal(component, null, this.createInjector(refControl));
		
		if (options.backdropClickClose) {
			ref.backdropClick().subscribe(() => refControl.close());
		}
		if (options.disablePhaserInput) {
			const key = ++OverlayService.disablePhaserInputKey;
			Globals.disablePhaserInput.add(key);
			ref.detachments().subscribe(() => Globals.disablePhaserInput.delete(key));
		}
		
		const compRef = ref.attach(portal);
		return {ref: refControl, instance: compRef.instance};
	}
	
	private createInjector(ref: OverlayRefControl): Injector {
		return Injector.create({
			parent: this.injector,
			providers: [
				{provide: OverlayRefControl, useValue: ref},
			],
		});
	}
	
	private getOverlayConfig(options: OverlayConfig): OverlayConfig {
		const config = {
			width: 0,
			height: 0,
			scrollStrategy: this.overlay.scrollStrategies.noop(),
			positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
		};
		const merged = {...config, ...options};
		return new OverlayConfig(merged);
	}
}
