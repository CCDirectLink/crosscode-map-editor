import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup, MatTab } from '@angular/material/tabs';
import { EditorView } from '../../models/editor-view';
import { GlobalEventsService } from '../../services/global-events.service';
import { MapLoaderService } from '../../services/map-loader.service';
import { CCMap } from '../../services/phaser/tilemap/cc-map';
import { FlexModule } from '@angular/flex-layout/flex';
import { LayersComponent } from '../layers/layers.component';
import { EntitiesComponent } from '../entities/entities.component';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [FlexModule, MatTabGroup, MatTab, LayersComponent, EntitiesComponent]
})
export class SidenavComponent implements OnInit {
	private mapLoader = inject(MapLoaderService);
	private globalEvents = inject(GlobalEventsService);

	
	activeTab = EditorView.Layers;
	tilemap?: CCMap;
	disableLayersTab = false;
	
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
