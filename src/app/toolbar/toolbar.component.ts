import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MapLoaderService} from '../shared/map-loader.service';
import {MdDialog} from '@angular/material';
import {MapSettingsComponent} from '../shared/dialogs/map-settings/map-settings.component';
import {CCMap} from '../shared/phaser/tilemap/cc-map';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

	@Output() onMenuClick = new EventEmitter();
	map: CCMap;

	constructor(private mapLoader: MapLoaderService,
				private dialog: MdDialog) {
	}

	ngOnInit() {
		this.mapLoader.tileMap.subscribe(map => {
			this.map = map;
			console.log(map);
		});
	}

	loadMap(event) {
		this.mapLoader.loadMap(event);
	}

	openMapSettings() {
		this.dialog.open(MapSettingsComponent, {
			data: this.map
		});
	}
}
