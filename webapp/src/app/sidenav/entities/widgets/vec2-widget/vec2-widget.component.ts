import {Component, Input, OnInit} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {Point} from '../../../../shared/interfaces/cross-code-map';

@Component({
	selector: 'app-vec2-widget',
	templateUrl: './vec2-widget.component.html',
	styleUrls: ['./vec2-widget.component.scss', '../../entities.component.scss']
})
export class Vec2WidgetComponent extends AbstractWidget implements OnInit {

	@Input() step = 1;
	@Input() minSize: Point = {x: -9999, y: -9999};
	@Input() enableX = true;
	@Input() enableY = true;

	constructor() {
		super();
	}

	ngOnInit() {
	}

	setVal(key, val) {
		val -= val % this.step;
		const setting = this.entity.details.settings[this.key];
		setting[key] = Math.max(val, this.minSize[key]);
		this.updateType();
	}

}
