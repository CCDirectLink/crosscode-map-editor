import { Component, inject, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';

import { AddEntityMenuService } from '../../services/add-entity-menu.service';
import { LoadMapComponent } from '../dialogs/load-map/load-map.component';
import { JsonLoaderService } from '../../services/json-loader.service';
import { FlexModule } from '@angular/flex-layout/flex';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PhaserComponent } from '../phaser/phaser.component';
import { RouterOutlet } from '@angular/router';
import { HistoryComponent } from '../dialogs/floating-window/history/history.component';
import { TileSelectorComponent } from '../dialogs/floating-window/tile-selector/tile-selector.component';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
	imports: [
		MatSidenavContainer,
		MatSidenav,
		LoadMapComponent,
		MatSidenavContent,
		FlexModule,
		ToolbarComponent,
		SidenavComponent,
		PhaserComponent,
		RouterOutlet,
		HistoryComponent,
		TileSelectorComponent
	]
})
export class EditorComponent {
	@ViewChild('loadmap', {static: true})
	loadmap!: LoadMapComponent;
	
	@ViewChild('sidenavLoadMap', {static: true})
	sidenavLoadMap!: MatSidenav;
	
	constructor() {
		const addEntity = inject(AddEntityMenuService);
		const jsonLoader = inject(JsonLoaderService);
		
		addEntity.init();
		
		// makes sure they are synchronously available
		jsonLoader.loadJsonMerged('actions.json');
		jsonLoader.loadJsonMerged('events.json');
		jsonLoader.loadJsonMerged('map-styles.json');
		
	}
	
	loadMapClicked() {
		this.sidenavLoadMap.toggle();
	}
	
	focusInput() {
		// has to wait before sidenav renders the content
		setTimeout(() => this.loadmap.focusInput(), 100);
	}
}
