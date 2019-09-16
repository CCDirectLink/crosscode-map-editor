import {Component, ViewChild} from '@angular/core';
import {LoadMapComponent} from '../load-map/load-map.component';
import {MatSidenav} from '@angular/material/sidenav';
import {AddEntityMenuService} from './add-entity-menu.service';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
	@ViewChild('loadmap', {static: true})
	loadmap!: LoadMapComponent;
	
	@ViewChild('sidenavLoadMap', {static: true})
	sidenavLoadMap!: MatSidenav;
	
	constructor(addEntity: AddEntityMenuService) {
		addEntity.init();
	}
	
	loadMapClicked() {
		this.sidenavLoadMap.toggle();
		this.loadmap.refresh();
	}
}
