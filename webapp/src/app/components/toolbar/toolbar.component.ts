import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MapLoaderService} from '../../shared/map-loader.service';
import {MatDialog} from '@angular/material';
import {MapSettingsComponent} from '../dialogs/map-settings/map-settings.component';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {GlobalEventsService} from '../../shared/global-events.service';
import {OffsetMapComponent} from '../dialogs/offset-map/offset-map.component';
import {environment} from '../../../environments/environment';
import {MapServerSocketService} from '../../services/map-serversocket.service';
@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

	@Output() onMenuClick = new EventEmitter();
	map: CCMap;
	loaded: boolean;
	version = environment.version;

	constructor(private mapLoader: MapLoaderService,
				private events: GlobalEventsService,
				private dialog: MatDialog,
				private mapServerSocket : MapServerSocketService) {
	}

	ngOnInit() {
		this.mapLoader.tileMap.subscribe(map => {
			this.map = map;
		});
		this.events.loadComplete.subscribe(isLoaded => this.loaded = isLoaded);

	}

	loadMap(event) {
		this.mapLoader.loadMap(event);
	}

	saveMap() {
		const file = new Blob([JSON.stringify(this.map.exportMap())], {type: 'application/json'});
		const a = document.createElement('a'),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = this.map.filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}

	mapServerSocketAvailable() {
		return this.mapServerSocket.isAvailable();
	}
	sendToCrossCode() {
		this.mapServerSocket.sendToCrossCode(this.map.exportMap());
	}
	openMapSettings() {
		this.dialog.open(MapSettingsComponent, {
			data: this.map
		});
	}
	
	generateHeights() {
		this.events.generateHeights.next();
	}
	
	offsetMap() {
		this.dialog.open(OffsetMapComponent, {
			data: this.map
		});
	}
}
