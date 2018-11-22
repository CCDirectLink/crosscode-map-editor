import {Injectable} from '@angular/core';
import {SharedModule} from '../shared.module';
import {Overlay, OverlayConfig} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {OverlayRefControl} from './overlay-ref-control';

@Injectable({
	providedIn: SharedModule
})

export class OverlayService {
	constructor(private overlay: Overlay) {
	
	}
	
	open(component, options: OverlayConfig = {}) {
		const config = this.getOverlayConfig(options);
		const ref = this.overlay.create(config);
		const portal = new ComponentPortal(component);
		
		const instance: any = ref.attach(portal).instance;
		return {ref: new OverlayRefControl(ref), instance: instance};
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
