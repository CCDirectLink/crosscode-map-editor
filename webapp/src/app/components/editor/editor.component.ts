import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NpcStatesComponent} from '../../shared/widgets/npc-states-widget/npc-states/npc-states.component';
import {OverlayService} from '../../overlay/overlay.service';
import {Overlay} from '@angular/cdk/overlay';
import { LoadMapComponent } from '../load-map/load-map.component';
import { MatSidenav } from '@angular/material/sidenav';

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

	constructor() {
	}

	loadMapClicked() {
		this.sidenavLoadMap.toggle();
		this.loadmap.refresh();
	}
}
