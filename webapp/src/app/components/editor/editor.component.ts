import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { AddEntityMenuService } from '../../services/add-entity-menu.service';
import { LoadMapComponent } from '../dialogs/load-map/load-map.component';
import { JsonLoaderService } from '../../services/json-loader.service';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
	standalone: false
})
export class EditorComponent {
	@ViewChild('loadmap', {static: true})
	loadmap!: LoadMapComponent;
	
	@ViewChild('sidenavLoadMap', {static: true})
	sidenavLoadMap!: MatSidenav;
	
	constructor(
		addEntity: AddEntityMenuService,
		jsonLoader: JsonLoaderService
	) {
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
