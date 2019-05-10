import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CrossCodeMap} from '../../../models/cross-code-map';
import { CCMap } from '../../../shared/phaser/tilemap/cc-map';
import * as mapSettingsjson from '../../../../assets/map-settings.json';

@Component({
  selector: 'app-new-map',
  templateUrl: './new-map.component.html',
  styleUrls: ['./new-map.component.scss']
})
export class NewMapComponent implements OnInit {
	map: CrossCodeMap;
	mapSettings;
	constructor(public ref: MatDialogRef<NewMapComponent>, @Inject(MAT_DIALOG_DATA) public data: CCMap) {
		this.map = this.createDefaultMap();
		this.mapSettings = mapSettingsjson.default;
	}

	ngOnInit() {
	}

	createDefaultMap() {
		return {
			mapWidth: 0,
			mapHeight: 0,
			name: 'Untitled',
			levels: [],
			masterLevel: 0,
			entities: [],
			layer: [],
			attributes: {
				saveMode: '',
				bgm: '',
				cameraInBounds: false,
				'map-sounds': '',
				mapStyle: '',
				weather: '',
				npcRunners: '',
				area: ''
			},
			screen: {
				x: 0,
				y: 0
			}
		};
	}
	close() {
		this.ref.close(this.map);
	}

}
