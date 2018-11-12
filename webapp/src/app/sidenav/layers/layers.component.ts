import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {CCMapLayer} from '../../shared/phaser/tilemap/cc-map-layer';
import {MapLoaderService} from '../../shared/map-loader.service';
import {animate, animateChild, keyframes, query, stagger, style, transition, trigger} from '@angular/animations';
// TODO: Make a map-config file for weather settings...
import {GlobalEventsService} from '../../shared/global-events.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {StateHistoryService} from '../../history/state-history.service';
import {Globals} from '../../shared/globals';
import {Point} from '../../shared/interfaces/cross-code-map';

@Component({
	selector: 'app-layers',
	templateUrl: './layers.component.html',
	styleUrls: ['./layers.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LayersComponent implements OnInit {
	
	selectedLayer: CCMapLayer;
	tilemap: CCMap;
	newLayerName = '';
	
	constructor(private mapLoader: MapLoaderService,
	            private stateHistory: StateHistoryService,
	            events: GlobalEventsService) {
		events.toggleVisibility.subscribe(() => {
			if (this.selectedLayer) {
				this.toggleVisibility({
					stopPropagation: () => {
					}
				}, this.selectedLayer);
			}
		});
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
	
	addNewLayer(event) {
		const map = this.tilemap;
		const data = [];
		for (let y = 0; y < map.mapHeight; y++) {
			data[y] = [];
			for (let x = 0; x < map.mapWidth; x++) {
				data[y][x] = 0;
			}
		}
		const layer = new CCMapLayer(Globals.game, {
			type: 'Background',
			name: this.newLayerName,
			level: 0,
			width: map.mapWidth,
			height: map.mapHeight,
			visible: 1,
			tilesetName: '',
			repeat: false,
			distance: 1,
			tilesize: Globals.TILE_SIZE,
			moveSpeed: {x: 0, y: 0},
			data: data,
		});
		console.log(layer);
		map.addLayer(layer);
		this.newLayerName = '';
		this.stateHistory.saveState({
			name: 'Layer added',
			icon: 'add'
		}, true);
	}
	
	deleteSelected() {
		const layer = this.selectedLayer;
		this.tilemap.removeLayer(layer);
		this.stateHistory.saveState({
			name: 'Layer deleted',
			icon: 'delete'
		}, true);
		
		this.selectLayer(null);
	}
	
	selectLayer(layer: CCMapLayer) {
		if (layer) {
			layer.visible = true;
		}
		this.mapLoader.selectedLayer.next(layer);
	}
	
	drop(event: CdkDragDrop<string[]>) {
		if (event.previousIndex === event.currentIndex) {
			return;
		}
		moveItemInArray(this.tilemap.layers, event.previousIndex, event.currentIndex);
		this.stateHistory.saveState({
			name: 'Layer moved',
			icon: 'open_with'
		}, true);
	}
	
}
