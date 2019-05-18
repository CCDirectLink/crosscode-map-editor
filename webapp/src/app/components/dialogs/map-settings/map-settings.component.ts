import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CrossCodeMap} from '../../../models/cross-code-map';
import {MapLoaderService} from '../../../shared/map-loader.service';
import {CCMap} from '../../../shared/phaser/tilemap/cc-map';
import * as mapSettingsjson from '../../../../assets/map-settings.json';
import {OverlayRefControl} from '../../../shared/overlay/overlay-ref-control';

@Component({
	selector: 'app-map-settings',
	templateUrl: './map-settings.component.html',
	styleUrls: ['./map-settings.component.scss']
})
export class MapSettingsComponent {
	
	private tileMap: CCMap;
	mapSettings = mapSettingsjson.default;
	settings: CrossCodeMap = <any>{
		levels: [{height: -32}, {height: 0}, {height: 32}, {height: 64}],
		attributes: {},
	};
	
	constructor(
		private loader: MapLoaderService,
		public ref: OverlayRefControl
	) {
		this.tileMap = loader.tileMap.getValue();
		const tileMap = this.tileMap;
		
		if (!tileMap) {
			return;
		}
		const settings = this.settings;
		
		settings.name = tileMap.name;
		
		settings.mapWidth = tileMap.mapWidth;
		settings.mapHeight = tileMap.mapHeight;
		settings.levels = tileMap.levels;
		settings.masterLevel = tileMap.masterLevel;
		settings.attributes = tileMap.attributes;
	}
	
	onSettingsChange({property, value}) {
		this.settings[property] = value;
	}

	update() {
		// TODO: add validation
		const settings = this.settings;
		const tileMap = this.tileMap;

		tileMap.name = settings.name;
		
		tileMap.levels = settings.levels;
		tileMap.masterLevel = settings.masterLevel;
		tileMap.attributes = settings.attributes;
		
		tileMap.resize(settings.mapWidth, settings.mapHeight);
		
		this.ref.close();
	}
}
