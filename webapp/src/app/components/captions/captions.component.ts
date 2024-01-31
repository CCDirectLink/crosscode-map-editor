import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Globals } from '../../services/globals';

export interface BottomUiElement {
	text?: string;
	active?: boolean;
}

@Component({
	selector: 'app-captions',
	templateUrl: './captions.component.html',
	styleUrls: ['./captions.component.scss'],
})
export class CaptionsComponent implements OnInit {
	version = environment.version;
	coords: BottomUiElement = {};
	selectionSize: BottomUiElement = {};
	
	uiElements: BottomUiElement[] = [
		this.coords,
		this.selectionSize
	];
	
	ngOnInit(): void {
		Globals.globalEventsService.updateCoords.subscribe(coords => {
			this.coords.text = `(${coords?.x}, ${coords?.y}, ${coords?.z})`;
			this.coords.active = !!coords;
		});
		
		Globals.globalEventsService.updateTileSelectionSize.subscribe(size => {
			this.selectionSize.text = `${size?.x}x${size?.y}`;
			this.selectionSize.active = !!size;
		});
	}
}
