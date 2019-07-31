import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {Point} from '../../../models/cross-code-map';

@Component({
	selector: 'app-vec2-widget',
	templateUrl: './vec2-widget.component.html',
	styleUrls: ['./vec2-widget.component.scss', '../widget.scss']
})
export class Vec2WidgetComponent extends AbstractWidget {
	
	@Input() step = 1;
	@Input() minSize: Point = {x: -9999, y: -9999};
	@Input() enableX = true;
	@Input() enableY = true;
	@Input() displayName = '';
	
	constructor() {
		super();
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
