import { Component, Input, OnChanges } from '@angular/core';
import { Point } from '../../../models/cross-code-map';
import { ScaleSettings } from '../../../services/phaser/entities/cc-entity';
import { AbstractWidget } from '../abstract-widget';

@Component({
	selector: 'app-vec2-widget',
	templateUrl: './vec2-widget.component.html',
	styleUrls: ['./vec2-widget.component.scss', '../widget.scss'],
	standalone: false,
})
export class Vec2WidgetComponent extends AbstractWidget implements OnChanges {
	@Input() def?: ScaleSettings;
	@Input() displayName = '';

	scaleSettings: ScaleSettings;

	constructor() {
		super();
		this.scaleSettings = this.updateScaleSettings();
	}

	override ngOnChanges(): void {
		super.ngOnChanges();
		this.scaleSettings = this.updateScaleSettings();
		if (!this.settings[this.key]) {
			const minSize = this.scaleSettings.baseSize;
			const value = {
				x: minSize.x > 0 ? minSize.x : 0,
				y: minSize.y > 0 ? minSize.y : 0,
			};
			this.settings[this.key] = value;
			this.updateType(value);
		}
	}

	toInt(value: string) {
		return parseInt(value, 10);
	}

	setVal(key: keyof Point, val: number) {
		const setting = this.settings[this.key];
		setting[key] = val;
		this.updateType(val);
	}

	applySnap(key: keyof Point) {
		const setting = this.settings[this.key];
		let val = setting[key] ?? 0;
		val -= val % this.scaleSettings.scalableStep;
		const value = Math.max(val, this.scaleSettings.baseSize[key]);
		this.setVal(key, value);
	}

	private updateScaleSettings(): ScaleSettings {
		if (this.def) {
			return this.def;
		}
		return {
			scalableX: true,
			scalableY: true,
			baseSize: { x: -9999, y: -9999 },
			scalableStep: 1,
		};
	}
}
