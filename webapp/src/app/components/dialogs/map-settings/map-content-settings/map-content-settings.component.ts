import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-content-settings',
  templateUrl: './map-content-settings.component.html',
  styleUrls: ['./map-content-settings.component.scss', '../map-settings.component.scss']
})
export class MapContentSettingsComponent implements OnInit {
	@Input() settings;
	@Input() mapSettings;
	constructor() { }

	ngOnInit() {
	}

}
