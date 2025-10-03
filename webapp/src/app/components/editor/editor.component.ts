import { Component, ViewChild, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { AddEntityMenuService } from '../../services/add-entity-menu.service';
import { JsonLoaderService } from '../../services/json-loader.service';
import { LoadMapComponent } from '../dialogs/load-map/load-map.component';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
	standalone: false,
})
export class EditorComponent {
	@ViewChild('loadmap', { static: true })
	loadmap!: LoadMapComponent;

	@ViewChild('sidenavLoadMap', { static: true })
	sidenavLoadMap!: MatSidenav;

	constructor() {
		const addEntity = inject(AddEntityMenuService);
		const jsonLoader = inject(JsonLoaderService);

		void addEntity.init();

		// makes sure they are synchronously available
		void jsonLoader.loadJsonMerged('actions.json');
		void jsonLoader.loadJsonMerged('events.json');
		void jsonLoader.loadJsonMerged('map-styles.json');
	}

	loadMapClicked() {
		void this.sidenavLoadMap.toggle();
	}

	focusInput() {
		// has to wait before sidenav renders the content
		setTimeout(() => this.loadmap.focusInput(), 100);
	}
}
