import {Injectable, Injector} from '@angular/core';
import {ComponentType, Overlay, OverlayConfig} from '@angular/cdk/overlay';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {OverlayRefControl} from './overlay-ref-control';
import {Globals} from '../renderer/globals';
import {OverlayModule} from './overlay.module';

interface CustomOverlayConfig extends OverlayConfig {
	backdropClickClose?: boolean;
	disablePhaserInput?: boolean;
}

@Injectable({
	providedIn: OverlayModule
})
export class OverlayService {
	constructor(
		private injector: Injector,
		private overlay: Overlay) {
	}
	
	open<T>(component: ComponentType<T>, options: CustomOverlayConfig = {}): { ref: OverlayRefControl, instance: T } {
		const config = this.getOverlayConfig(options);
		const ref = this.overlay.create(config);
		const refControl = new OverlayRefControl(ref);
		const portal = new ComponentPortal(component, null, this.createInjector(refControl));
		
		if (options.backdropClickClose) {
			ref.backdropClick().subscribe(() => refControl.close());
		}
		if (options.disablePhaserInput) {
			Globals.disablePhaserInput = true;
			ref.detachments().subscribe(() => Globals.disablePhaserInput = false);
		}
		
		const instance: any = ref.attach(portal).instance;
		return {ref: refControl, instance: instance};
	}
	
	private createInjector(ref: OverlayRefControl): PortalInjector {
		const injectionTokens = new WeakMap();
		injectionTokens.set(OverlayRefControl, ref);
		return new PortalInjector(this.injector, injectionTokens);
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
