import {Component, OnInit} from '@angular/core';
import {CrossCodeMap} from '../../../models/cross-code-map';
import {OverlayRefControl} from '../../../shared/overlay/overlay-ref-control';
import {MapLoaderService} from '../../../shared/map-loader.service';

@Component({
	selector: 'app-new-map',
	templateUrl: './new-map.component.html',
	styleUrls: ['./new-map.component.scss']
})
export class NewMapComponent implements OnInit {
	map: CrossCodeMap;
	
	constructor(private mapLoader: MapLoaderService, public ref: OverlayRefControl) {
		this.map = this.createDefaultMap();
	}
	
	ngOnInit() {
	}
	
	onSettingsChange(obj: { property: keyof CrossCodeMap, value: any }) {
		this.map[obj.property] = obj.value;
	}
	
	createDefaultMap(): CrossCodeMap {
		return {
			mapWidth: 1,
			mapHeight: 1,
			name: 'Untitled',
			levels: [{
				height: 0
			}],
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
			},
			filename: 'newMap'
		};
	}
	
	close() {
		this.mapLoader.loadRawMap(this.map, this.map.name);
		this.ref.close();
	}
	
}
