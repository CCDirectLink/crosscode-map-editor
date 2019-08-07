import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {LoaderService} from '../../services/loader.service';
import {CCMap} from '../../renderer/phaser/tilemap/cc-map';
import {CCMapLayer} from '../../renderer/phaser/tilemap/cc-map-layer';
import {EditorView} from '../../models/editor-view';
import {MatTabChangeEvent} from '@angular/material';
import { EventService } from '../../services/event.service';

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
		private mapLoader: LoaderService,
		private events: EventService,
	) {
	}
	
	ngOnInit() {
		this.events.selectedLayer.subscribe(layer => {
			if (layer) {
				this.selectedLayer = layer;
			}
		});
		this.events.tileMap.subscribe(tilemap => {
			this.tilemap = tilemap;
			this.events.currentView.next(EditorView.Layers);
		});
		this.events.currentView.subscribe(view => {
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
		this.events.currentView.next(event.index === 0 ? EditorView.Layers : EditorView.Entities);
	}
}
