import { Component } from '@angular/core';

import { CrossCodeMap } from '../../../models/cross-code-map';
import { MapLoaderService } from '../../../services/map-loader.service';
import { CCMap } from '../../../services/phaser/tilemap/cc-map';
import { OverlayRefControl } from '../overlay/overlay-ref-control';
import { GlobalEventsService } from '../../../services/global-events.service';

@Component({
	selector: 'app-map-settings',
	templateUrl: './map-settings.component.html',
	styleUrls: ['./map-settings.component.scss']
})
export class MapSettingsComponent {
	
	private readonly tileMap: CCMap;
	settings: CrossCodeMap = <any>{
		levels: [{height: -32}, {height: 0}, {height: 32}, {height: 64}],
		attributes: {},
	};
	
	constructor(
		loader: MapLoaderService,
		public ref: OverlayRefControl,
		private events: GlobalEventsService
	) {
		const tileMap = loader.tileMap.getValue();
		
		if (!tileMap) {
			throw new Error('tilemap not defined');
		}
		
		this.tileMap = tileMap;
		
		const settings = this.settings;
		
		settings.name = tileMap.name;
		
		settings.mapWidth = tileMap.mapWidth;
		settings.mapHeight = tileMap.mapHeight;
		settings.levels = tileMap.levels;
		settings.masterLevel = tileMap.masterLevel;
		settings.attributes = tileMap.attributes;
	}
	
	onSettingsChange(obj: { property: keyof CrossCodeMap, value: any }) {
		(this.settings[obj.property] as any) = obj.value;
	}
	
	update() {
		// TODO: add validation
		const settings = this.settings;
		const tileMap = this.tileMap;
		
		tileMap.name = settings.name;
		tileMap.filename = settings.name;
		tileMap.levels = settings.levels;
		tileMap.masterLevel = settings.masterLevel;
		tileMap.attributes = settings.attributes;
		
		this.events.resizeMap.next({
			x: settings.mapWidth,
			y: settings.mapHeight
		});
		
		this.ref.close();
	}
}
