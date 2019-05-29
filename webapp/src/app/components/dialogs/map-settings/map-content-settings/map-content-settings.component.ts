import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import * as mapSettingsjson from '../../../../../assets/map-settings.json';

@Component({
  selector: 'app-map-content-settings',
  templateUrl: './map-content-settings.component.html',
  styleUrls: ['./map-content-settings.component.scss']
})
export class MapContentSettingsComponent implements OnInit {
	@Input() settings;
	@Output() onSettingsChange = new EventEmitter<any>();
	mapSettings = mapSettingsjson.default;
	
	constructor() { }

	ngOnInit() {
	}

	onNumberChange(event, property) {
		const numElement = event.target;
		if (numElement) {
			const min = Number(numElement.min || -Infinity);
			const max = Number(numElement.max || Infinity);
			let value = Number(numElement.value);
			
			if (value < min) {
				value = min;
			} else if (value > max) {
				value = max;
			}
			// Parent won't update field if same value
			// force update value property
			numElement.value = value;

			this.onSettingsChange.emit({
				property,
				value
			});
		}
	}

}
