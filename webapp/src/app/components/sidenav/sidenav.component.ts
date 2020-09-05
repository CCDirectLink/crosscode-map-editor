import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MapLoaderService } from '../../shared/map-loader.service';
import { CCMap } from '../../shared/phaser/tilemap/cc-map';
import { CCMapLayer } from '../../shared/phaser/tilemap/cc-map-layer';
import { EditorView } from '../../models/editor-view';
import { GlobalEventsService } from '../../shared/global-events.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

	activeTab = EditorView.Layers;
	selectedLayer?: CCMapLayer;
	tilemap?: CCMap;
	editorViewEnum = EditorView;
	disableLayersTab = false;

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
			const currentView = this.globalEvents.currentView;
			currentView.next(currentView.value); //Update select mode
		});
		this.globalEvents.currentView.subscribe(view => {
			if (view !== undefined && this.activeTab !== view) {
				this.activeTab = view;
			}
		});
		this.globalEvents.is3D.subscribe(is3d => {
			this.disableLayersTab = is3d;
		});
	}

	tabChanged(event: MatTabChangeEvent) {
		this.globalEvents.currentView.next(event.index === 0 ? EditorView.Layers : EditorView.Entities);
	}
}
