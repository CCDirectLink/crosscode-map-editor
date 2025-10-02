import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { EditorView } from '../../models/editor-view';
import { GlobalEventsService } from '../../services/global-events.service';
import { MapLoaderService } from '../../services/map-loader.service';
import { CCMap } from '../../services/phaser/tilemap/cc-map';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	encapsulation: ViewEncapsulation.None,
	standalone: false
})
export class SidenavComponent implements OnInit {
	
	activeTab = EditorView.Layers;
	tilemap?: CCMap;
	disableLayersTab = false;
	
	constructor(
		private mapLoader: MapLoaderService,
		private globalEvents: GlobalEventsService
	) {
	}
	
	ngOnInit() {
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
