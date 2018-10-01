import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {CCMapLayer} from '../../shared/phaser/tilemap/cc-map-layer';
import {MapLoaderService} from '../../shared/map-loader.service';
import {animate, animateChild, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
	selector: 'app-layers',
	templateUrl: './layers.component.html',
	styleUrls: ['./layers.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LayersComponent implements OnInit {
	
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
		if (layer.visible) {
			this.selectLayer(layer);
		}
	}
	
	selectLayer(layer: CCMapLayer) {
		layer.visible = true;
		this.mapLoader.selectedLayer.next(layer);
	}
	
}
