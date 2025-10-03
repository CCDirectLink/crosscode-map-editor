import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import mapSettingsjson from '../../../../../assets/map-settings.json';
import { CrossCodeMap } from '../../../../models/cross-code-map';

@Component({
	selector: 'app-map-content-settings',
	templateUrl: './map-content-settings.component.html',
	styleUrls: ['./map-content-settings.component.scss'],
	standalone: false,
})
export class MapContentSettingsComponent implements OnInit {
	@Input() settings!: CrossCodeMap;

	// TODO: why is there an output?
	//  All other components using this event just set the setting to the object,
	//  this could be handled here without emitting an event
	@Output() onSettingsChange = new EventEmitter<{
		property: any;
		value: any;
	}>();
	mapSettings = mapSettingsjson;

	constructor() {}

	ngOnInit() {
		if (this.settings.levels.length < 1) {
			this.settings.levels.push({
				height: 0,
			});
		}
	}

	onNumberChange(event: Event, property: string): void {
		const numElement = event.target as HTMLInputElement;
		if (numElement) {
			const min = Number(numElement.min || -Infinity);
			const max = Number(numElement.max || Infinity);
			let value = Number(numElement.value);

			if (isNaN(value)) {
				value = min;
			} else if (!Number.isInteger(value)) {
				value = Math.round(value);
			}

			if (value < min) {
				value = min;
			} else if (value > max) {
				value = max;
			}

			// Parent won't update field if same value
			// force update value property
			numElement.value = value + '';

			this.onSettingsChange.emit({
				property,
				value,
			});
		}
	}

	guessHeight(): number {
		const levels = this.settings.levels;
		if (levels.length === 0) {
			return 0;
		}
		if (levels.length === 1) {
			return levels[0].height + 16;
		}
		const [l1, l2] = levels.slice(-2);
		return l2.height + (l2.height - l1.height);
	}
}
