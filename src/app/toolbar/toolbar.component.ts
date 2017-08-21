import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MapLoaderService} from '../shared/map-loader.service';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

	@Output() onMenuClick = new EventEmitter();
	mapName: string;

	constructor(private mapLoader: MapLoaderService) {
	}

	ngOnInit() {
		this.mapLoader.map.subscribe((map) => {
			if (map) {
				this.mapName = map.name;
			} else {
				this.mapName = '';
			}
		});
	}

	loadMap(event) {
		this.mapLoader.loadMap(event);
	}
}
