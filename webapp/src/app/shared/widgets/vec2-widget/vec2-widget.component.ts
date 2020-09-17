import {Component, Input, OnChanges} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {Point} from '../../../models/cross-code-map';
import {ScaleSettings} from '../../phaser/entities/cc-entity';

@Component({
	selector: 'app-vec2-widget',
	templateUrl: './vec2-widget.component.html',
	styleUrls: ['./vec2-widget.component.scss', '../widget.scss']
})
export class Vec2WidgetComponent extends AbstractWidget implements OnChanges {
	
	@Input() def?: ScaleSettings;
	@Input() displayName = '';
	
	scaleSettings: ScaleSettings;
	
	constructor() {
		super();
		this.scaleSettings = this.updateScaleSettings();
	}
	
	ngOnChanges(): void {
		super.ngOnChanges();
		this.scaleSettings = this.updateScaleSettings();
		if (!this.settings[this.key]) {
			const minSize = this.scaleSettings.baseSize;
			this.settings[this.key] = {
				x: minSize.x > 0 ? minSize.x : 1,
				y: minSize.y > 0 ? minSize.y : 1
			};
			this.updateType();
		}
	}
	
	toInt(value: string) {
		return parseInt(value, 10);
	}
	
	setVal(key: keyof Point, val: number) {
		val -= val % this.scaleSettings.scalableStep;
		const setting = this.settings[this.key];
		setting[key] = Math.max(val, this.scaleSettings.baseSize[key]);
		this.updateType();
	}
	
	private updateScaleSettings(): ScaleSettings {
		if (this.def) {
			return this.def;
		}
		return {
			scalableX: true,
			scalableY: true,
			baseSize: {x: -9999, y: -9999},
			scalableStep: 1
		};
	}
	
}
