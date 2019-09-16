import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {Point} from '../../../models/cross-code-map';

@Component({
	selector: 'app-vec2-widget',
	templateUrl: './vec2-widget.component.html',
	styleUrls: ['./vec2-widget.component.scss', '../widget.scss']
})
export class Vec2WidgetComponent extends AbstractWidget implements OnChanges {
	
	@Input() step = 1;
	@Input() minSize: Point = {x: -9999, y: -9999};
	@Input() enableX = true;
	@Input() enableY = true;
	@Input() displayName = '';
	
	constructor() {
		super();
	}
	
	ngOnChanges(changes?: SimpleChanges): void {
		super.ngOnChanges(changes);
		if (!this.settings[this.key]) {
			this.settings[this.key] = {
				x: this.minSize.x > 0 ? this.minSize.x : 1,
				y: this.minSize.y > 0 ? this.minSize.y : 1
			};
			this.updateType();
		}
	}
	
	toInt(value: string) {
		return parseInt(value, 10);
	}
	
	setVal(key: keyof Point, val: number) {
		val -= val % this.step;
		const setting = this.settings[this.key];
		setting[key] = Math.max(val, this.minSize[key]);
		this.updateType();
	}
	
}
