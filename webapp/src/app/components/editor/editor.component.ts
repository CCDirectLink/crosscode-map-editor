import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NpcStatesComponent} from '../../shared/widgets/npc-states-widget/npc-states/npc-states.component';
import {OverlayService} from '../../shared/overlay/overlay.service';
import {Overlay} from '@angular/cdk/overlay';
import {SelectedTile} from '../../models/tile-selector';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
	
	constructor() {
	}
}
