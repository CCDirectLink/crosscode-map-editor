import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MapLoaderService} from '../shared/map-loader.service';
import {CrossCodeMap, MapLayer} from '../shared/interfaces/cross-code-map';
import {CCMap} from '../shared/phaser/tilemap/cc-map';
import {CCMapLayer} from '../shared/phaser/tilemap/cc-map-layer';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

	selectedLayer: CCMapLayer;
	tilemap: CCMap;

	constructor(private mapLoader: MapLoaderService) {
	}

	ngOnInit() {
		this.mapLoader.selectedLayer.subscribe(layer => this.selectedLayer = layer);
		this.mapLoader.tileMap.subscribe(tilemap => this.tilemap = tilemap);
	}

	getDisplayName(layer: CCMapLayer): string {
		return `${layer.details.name} (${layer.details.level})`;
	}

	toggleVisibility(event, layer: CCMapLayer) {
		event.stopPropagation();
		layer.visible = !layer.visible;
	}

	selectLayer(layer: CCMapLayer) {
		this.mapLoader.selectedLayer.next(layer);
		console.log(layer);
	}
}
