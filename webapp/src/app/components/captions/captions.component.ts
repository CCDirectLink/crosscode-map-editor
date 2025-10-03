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
	standalone: false,
})
export class CaptionsComponent implements OnInit {
	version = environment.version;
	coords: BottomUiElement = {};
	selectionSize: BottomUiElement = {};
	autotile: BottomUiElement = {
		text: 'Autotile',
	};

	uiElements: BottomUiElement[] = [
		this.coords,
		this.selectionSize,
		this.autotile,
	];

	ngOnInit(): void {
		Globals.globalEventsService.updateCoords.subscribe((coords) => {
			this.coords.text = `(${coords?.x}, ${coords?.y}, ${coords?.z})`;
			this.coords.active = !!coords;
		});

		Globals.globalEventsService.updateTileSelectionSize.subscribe(
			(size) => {
				this.selectionSize.text = `${size?.x}x${size?.y}`;
				this.selectionSize.active = !!size;
			},
		);

		Globals.globalEventsService.isAutotile.subscribe((show) => {
			this.autotile.active = show;
		});
	}
}
