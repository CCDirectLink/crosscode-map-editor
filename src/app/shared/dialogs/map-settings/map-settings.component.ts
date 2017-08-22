import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {CrossCodeMap} from '../../interfaces/cross-code-map';
import {MapLoaderService} from '../../map-loader.service';

@Component({
	selector: 'app-map-settings',
	templateUrl: './map-settings.component.html',
	styleUrls: ['./map-settings.component.scss']
})
export class MapSettingsComponent {

	private tileMap: Phaser.Tilemap;

	settings: CrossCodeMap = <any>{
		levels: [{height: -32}, {height: 0}, {height: 32}, {height: 64}],
		attributes: {},
	};

	constructor(private loader: MapLoaderService, public ref: MdDialogRef<MapSettingsComponent>) {
		this.tileMap = loader.tileMap.getValue();
		const tileMap = this.tileMap;

		if (!tileMap) {
			return;
		}
		const settings = this.settings;
		Object.assign(settings, tileMap.crossCode);
		settings.mapWidth = tileMap.width;
		settings.mapHeight = tileMap.height;
		settings.entities = undefined;
		settings.layer = undefined;

		console.log(settings);
	}

	update() {
		// TODO: add validation
		const settings = this.settings;
		const tileMap = this.tileMap;
		tileMap.crossCode.levels = settings.levels;
		tileMap.crossCode.masterLevel = settings.masterLevel;
		tileMap.crossCode.attributes = settings.attributes;

		// resize
		tileMap.width = settings.mapWidth;
		tileMap.height = settings.mapHeight;
		// tileMap.widthInPixels =

		const layers = this.loader.layers.getValue();
		layers.forEach(layer => {
			layer.resize(settings.mapWidth * tileMap.tileWidth, settings.mapHeight * tileMap.tileHeight);
			layer.layer.width = settings.mapWidth;
			layer.layer.height = settings.mapHeight;
			// layer.layer.resize(settings.mapWidth, settings.mapHeight);
		});
		this.ref.close();
	}
}
