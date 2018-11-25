import {Injectable} from '@angular/core';
import {SharedModule} from '../shared.module';
import {ComponentType, Overlay, OverlayConfig} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {OverlayRefControl} from './overlay-ref-control';
import {Globals} from '../globals';

interface CustomOverlayConfig extends OverlayConfig {
	backdropClickClose?: boolean;
	disablePhaserInput?: boolean;
}

@Injectable({
	providedIn: SharedModule
})
export class OverlayService {
	constructor(private overlay: Overlay) {
	
	}
	
	open<T>(component: ComponentType<T>, options: CustomOverlayConfig = {}): { ref: OverlayRefControl, instance: T } {
		const config = this.getOverlayConfig(options);
		const ref = this.overlay.create(config);
		const portal = new ComponentPortal(component);
		
		const refControl = new OverlayRefControl(ref);
		
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
