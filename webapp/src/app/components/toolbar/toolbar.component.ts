import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MapLoaderService} from '../../shared/map-loader.service';
import {MatDialog} from '@angular/material';
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
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Router} from '@angular/router';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
	
	isElectron = Globals.isElectron;
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
	            private router: Router,
	            private save: SaveService,
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
		
		this.events.loadComplete.subscribe(() => {
			// this.mapLoader.loadMapByName('tests/3d/3dtest');
			// this.mapLoader.loadMapByName('tests/3d/flicker');
			// this.mapLoader.loadMapByName('tests/3d/3dboxtest');
			// this.mapLoader.loadMapByName('tests/3d/path-1-entrance-entities');
			// this.mapLoader.loadMapByName('bergen/bergen');
			this.mapLoader.loadMapByName('bergen-trail/path-1-entrance');
			// this.mapLoader.loadMapByName('autumn/entrance');
			// this.mapLoader.loadMapByName('bergen-trail/test');
			// this.mapLoader.loadMapByName('arid/cliff-1');
			// this.mapLoader.loadMapByName('bergen/mine-entrance');
			// this.mapLoader.loadMapByName('forest/caves/cave-013-pandza-01');
		});
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
	
	changeTo3d(event: MatSlideToggleChange) {
		this.router.navigate([event.checked ? '3d' : '']);
	}
}
