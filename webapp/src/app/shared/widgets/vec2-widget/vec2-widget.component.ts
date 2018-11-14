import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {Point} from '../../../models/cross-code-map';

@Component({
	selector: 'app-vec2-widget',
	templateUrl: './vec2-widget.component.html',
	styleUrls: ['./vec2-widget.component.scss', '../widget.scss']
})
export class Vec2WidgetComponent extends AbstractWidget implements OnInit, OnChanges {

	@Input() step = 1;
	@Input() custom = null;
	@Input() minSize: Point = {x: -9999, y: -9999};
	@Input() enableX = true;
	@Input() enableY = true;
	@Input() displayName;
	
	settings;

	constructor() {
		super();
	}

	ngOnInit() {
	}
	
	ngOnChanges(changes: SimpleChanges): void {
		this.settings = this.custom || this.entity.details.settings;
	}
	
	setVal(key, val) {
		val -= val % this.step;
		const setting = this.settings[this.key];
		setting[key] = Math.max(val, this.minSize[key]);
		this.updateType();
	}

}
