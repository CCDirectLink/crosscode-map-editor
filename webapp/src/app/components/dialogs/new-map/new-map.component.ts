import { Component, inject } from '@angular/core';

import { CrossCodeMap } from '../../../models/cross-code-map';
import { MapLoaderService } from '../../../services/map-loader.service';
import { OverlayRefControl } from '../overlay/overlay-ref-control';

@Component({
	selector: 'app-new-map',
	templateUrl: './new-map.component.html',
	styleUrls: ['./new-map.component.scss'],
	standalone: false,
})
export class NewMapComponent {
	private mapLoader = inject(MapLoaderService);
	ref = inject(OverlayRefControl);

	map: CrossCodeMap;

	constructor() {
		this.map = this.createDefaultMap();
	}

	onSettingsChange(obj: { property: keyof CrossCodeMap; value: any }) {
		(this.map[obj.property] as any) = obj.value;
	}

	createDefaultMap(): CrossCodeMap {
		return {
			mapWidth: 1,
			mapHeight: 1,
			name: 'Untitled',
			levels: [
				{
					height: 0,
				},
			],
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
				area: '',
			},
			screen: {
				x: 0,
				y: 0,
			},
			filename: 'newMap',
		};
	}

	close() {
		this.mapLoader.loadRawMap(
			this.map,
			this.map.name,
			`data/maps/${this.map.name}.json`,
		);
		this.ref.close();
	}
}
