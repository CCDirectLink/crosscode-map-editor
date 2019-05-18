import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import {CrossCodeMap} from '../../../models/cross-code-map';
import * as mapSettingsjson from '../../../../assets/map-settings.json';
import {OverlayRefControl} from '../../../shared/overlay/overlay-ref-control';
import {MapLoaderService} from '../../../shared/map-loader.service';

@Component({
  selector: 'app-new-map',
  templateUrl: './new-map.component.html',
  styleUrls: ['./new-map.component.scss']
})
export class NewMapComponent implements OnInit {
	map: CrossCodeMap;
	mapSettings;
	constructor(private mapLoader: MapLoaderService, private ref: OverlayRefControl, private changeDetectorRef: ChangeDetectorRef)  {
		this.map = this.createDefaultMap();
		this.mapSettings = mapSettingsjson.default;
	}

	ngOnInit() {
	}

	onSettingsChange({property, value}) {
		this.map[property] = value;
	}

	createDefaultMap(): CrossCodeMap {
		const defaultMap: CrossCodeMap = {
			mapWidth: 1,
			mapHeight: 1,
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

		return defaultMap;
	}
	close() {
		this.mapLoader.loadRawMap(this.map);
		this.ref.close();
	}

}
