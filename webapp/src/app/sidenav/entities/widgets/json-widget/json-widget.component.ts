import {Component, Input, OnInit} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-json-widget',
	templateUrl: './json-widget.component.html',
	styleUrls: ['./json-widget.component.scss', '../../entities.component.scss']
})
export class JsonWidgetComponent extends AbstractWidget implements OnInit {
	
	@Input() custom;
	
	private timer;
	json = JSON;
	
	constructor() {
		super();
	}
	
	ngOnInit() {
	}
	
	setCustomSetting(key, value) {
		if (this.timer !== undefined) {
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(() => {
			value = JSON.parse(value);
			if (this.custom) {
				this.custom[key] = value;
			} else {
				this.entity.details.settings[key] = value;
			}
			this.updateType();
		}, 500);
	}
}
