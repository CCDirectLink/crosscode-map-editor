import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';

@Component({
  selector: 'app-map-content-settings',
  templateUrl: './map-content-settings.component.html',
  styleUrls: ['./map-content-settings.component.scss', '../map-settings.component.scss']
})
export class MapContentSettingsComponent implements OnInit, OnChanges {
	@Input() settings;
	@Output() onSettingsChange = new EventEmitter<any>()
	@Input() mapSettings;
	constructor(private changeDetectorRef: ChangeDetectorRef) { }

	ngOnInit() {
	}

	onNumberChange(event, property) {
		const numElement = event.target;
		if (numElement) {
			const min = Number(numElement.min || -Infinity);
			const max = Number(numElement.max || Infinity);
			let val = Number(numElement.value);
			
			if (val < min) {
				val = min;
			} else if (val > max) {
				val = max;
			}
			// Parent won't update field if same value
			// force update value property
			numElement.value = val;

			this.onSettingsChange.emit({
				property,
				value : val
			});
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
	}

}
