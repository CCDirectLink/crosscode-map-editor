import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MapLoaderService} from '../../shared/map-loader.service';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {CCMapLayer} from '../../shared/phaser/tilemap/cc-map-layer';
import {EditorView} from '../../models/editor-view';
import {GlobalEventsService} from '../../shared/global-events.service';
import {MatTabChangeEvent} from '@angular/material';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {
	
	activeTab = 0;
	selectedLayer?: CCMapLayer;
	tilemap?: CCMap;
	currentView?: EditorView;
	editorViewEnum = EditorView;
	
	constructor(
		private mapLoader: MapLoaderService,
		private globalEvents: GlobalEventsService
	) {
	}
	
	ngOnInit() {
		this.mapLoader.selectedLayer.subscribe(layer => {
			if (layer) {
				this.selectedLayer = layer;
			}
		});
		this.mapLoader.tileMap.subscribe(tilemap => {
			this.tilemap = tilemap;
			this.globalEvents.currentView.next(EditorView.Layers);
		});
		this.globalEvents.currentView.subscribe(view => {
			this.currentView = view;
			switch (view) {
				case EditorView.Layers:
					this.activeTab = 0;
					break;
				case EditorView.Entities:
					this.activeTab = 1;
					break;
			}
		});
		
	}
	
	tabChanged(event: MatTabChangeEvent) {
		this.globalEvents.currentView.next(event.index === 0 ? EditorView.Layers : EditorView.Entities);
	}
}
