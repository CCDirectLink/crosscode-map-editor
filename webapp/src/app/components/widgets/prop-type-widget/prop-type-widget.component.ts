import { Component } from '@angular/core';
import { OverlayWidget } from '../overlay-widget';
import { PropTypeOverlayComponent } from './prop-type-overlay/prop-type-overlay.component';

@Component({
	selector: 'app-prop-type-widget',
	templateUrl: './prop-type-widget.component.html',
	styleUrls: ['./prop-type-widget.component.scss', '../widget.scss']
})
export class PropTypeWidgetComponent extends OverlayWidget {
	
	override openInternal() {
		const obj = this.overlayService.open(PropTypeOverlayComponent, {
			positionStrategy: this.overlay.position().global()
				.left('330px')
				.top('calc(64px + 1vh)'),
			hasBackdrop: false,
			disablePhaserInput: true
		});
		
		obj.instance.entity = this.entity;
		obj.instance.key = this.key;
		obj.instance.attribute = this.attribute;
		obj.instance.custom = this.settings[this.key];
		
		obj.instance.exit.subscribe(() => {
			this.close();
		});
		
		return obj.ref;
	}
	
}
