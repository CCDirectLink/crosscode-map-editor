import { Component } from '@angular/core';
import { EnemyTypeWidgetOverlayComponent } from './enemy-type-overlay/enemy-type-overlay.component';
import { OverlayWidget } from '../overlay-widget';

@Component({
	selector: 'app-enemy-type-widget',
	templateUrl: './enemy-type-widget.component.html',
	styleUrls: ['./enemy-type-widget.component.scss', '../widget.scss']
})
export class EnemyTypeWidgetComponent extends OverlayWidget {
	
	override async openInternal() {
		const obj = this.overlayService.open(EnemyTypeWidgetOverlayComponent, {
			positionStrategy: this.overlay.position().global(),
			hasBackdrop: false,
			disablePhaserInput: true
		});
		
		obj.instance.entity = this.entity;
		obj.instance.key = this.key;
		obj.instance.attribute = this.attribute;
		obj.instance.custom = this.custom;
		
		obj.instance.exit.subscribe(() => {
			this.close();
		});
		
		return obj.ref;
	}
}
