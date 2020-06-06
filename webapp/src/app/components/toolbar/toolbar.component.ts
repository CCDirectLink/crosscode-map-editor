import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MapLoaderService} from '../../shared/map-loader.service';
import {MatDialog} from '@angular/material/dialog';
import {MapSettingsComponent} from '../dialogs/map-settings/map-settings.component';
import {NewMapComponent} from '../dialogs/new-map/new-map.component';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {GlobalEventsService} from '../../shared/global-events.service';
import {OffsetMapComponent} from '../dialogs/offset-map/offset-map.component';
import {environment} from '../../../environments/environment';
import {OverlayService} from '../../shared/overlay/overlay.service';
import {Overlay} from '@angular/cdk/overlay';
import {SettingsComponent} from '../dialogs/settings/settings.component';
import {Globals} from '../../shared/globals';
import {SaveService} from '../../services/save.service';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
	
	map?: CCMap;
	loaded = false;
	error = '';
	version = environment.version;
	
	@Output()
	public loadMapClicked = new EventEmitter<void>(false);
	
	constructor(private mapLoader: MapLoaderService,
				private events: GlobalEventsService,
				private dialog: MatDialog,
				private overlayService: OverlayService,
				private overlay: Overlay,
				private save: SaveService
	) {
	}
	
	ngOnInit() {
		this.mapLoader.tileMap.subscribe(map => {
			this.map = map;
		});
		this.events.loadComplete.subscribe(
			() => this.loaded = true,
			err => this.error = 'Error: could not load CrossCode assets. Update path in edit/settings'
		);
		
		// this.events.loadComplete.subscribe(() => {
		// 	this.mapLoader.loadMapByName('bergen-trail/test');
		// });
	}
	
	saveMap(saveAs: boolean) {
		if (!this.map) {
			throw new Error('no map loaded');
		}
		
		if (saveAs) {
			this.save.saveMapAs(this.map);
		} else {
			this.save.saveMap(this.map);
		}
	}
	
	newMap() {
		this.overlayService.open(NewMapComponent, {
			positionStrategy: this.overlay.position().global()
				.left('23vw')
				.top('calc(64px + 6vh / 2)'),
			hasBackdrop: true
		});
	}
	
	openMapSettings() {
		this.overlayService.open(MapSettingsComponent, {
			positionStrategy: this.overlay.position().global()
				.left('23vw')
				.top('calc(64px + 6vh / 2)'),
			hasBackdrop: true
		});
	}
	
	generateHeights(forceAll: boolean) {
		this.events.generateHeights.next(forceAll);
	}
	
	offsetMap() {
		this.dialog.open(OffsetMapComponent, {
			data: this.map
		});
	}
	
	showSettings() {
		this.overlayService.open(SettingsComponent, {
			positionStrategy: this.overlay.position().global()
				.left('23vw')
				.top('calc(64px + 6vh / 2)'),
			hasBackdrop: true
		});
	}
}
