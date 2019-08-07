import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CrossCodeMap} from '../../../models/cross-code-map';
import {LoaderService} from '../../../services/loader.service';
import {CCMap} from '../../../renderer/phaser/tilemap/cc-map';
import {OverlayRefControl} from '../../../overlay/overlay-ref-control';
import { EventService } from '../../../services/event.service';

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
		events: EventService,
		public ref: OverlayRefControl
	) {
		const tileMap = events.tileMap.getValue();
		
		if (!tileMap) {
			throw new Error('tilemap not defined');
		}
		
		this.tileMap = tileMap;
		
		const settings = this.settings;
		
		settings.name = tileMap.data.name;
		
		settings.mapWidth = tileMap.data.mapWidth;
		settings.mapHeight = tileMap.data.mapHeight;
		settings.levels = tileMap.data.levels;
		settings.masterLevel = tileMap.data.masterLevel;
		settings.attributes = tileMap.data.attributes;
	}
	
	onSettingsChange(obj: { property: keyof CrossCodeMap, value: any }) {
		this.settings[obj.property] = obj.value;
	}
	
	update() {
		// TODO: add validation
		const settings = this.settings;
		const tileMap = this.tileMap;
		
		tileMap.data.name = settings.name;
		tileMap.data.filename = settings.name;
		tileMap.data.levels = settings.levels;
		tileMap.data.masterLevel = settings.masterLevel;
		tileMap.data.attributes = settings.attributes;
		
		tileMap.resize(settings.mapWidth, settings.mapHeight);
		
		this.ref.close();
	}
}
