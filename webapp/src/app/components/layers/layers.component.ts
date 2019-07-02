import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CCMap} from '../../shared/phaser/tilemap/cc-map';
import {CCMapLayer} from '../../shared/phaser/tilemap/cc-map-layer';
import {MapLoaderService} from '../../shared/map-loader.service';
import {GlobalEventsService} from '../../shared/global-events.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {StateHistoryService} from '../../shared/history/state-history.service';
import {Globals} from '../../shared/globals';

@Component({
	selector: 'app-layers',
	templateUrl: './layers.component.html',
	styleUrls: ['./layers.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LayersComponent implements OnInit {
	
	selectedLayer?: CCMapLayer;
	tilemap?: CCMap;
	newLayerName = '';
	
	constructor(private mapLoader: MapLoaderService,
	            private stateHistory: StateHistoryService,
	            events: GlobalEventsService) {
		events.toggleVisibility.subscribe(() => {
			if (this.selectedLayer) {
				this.toggleVisibility(<any>{
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
	
	toggleVisibility(event: Event, layer: CCMapLayer) {
		event.stopPropagation();
		layer.visible = !layer.visible;
		if (layer.visible) {
			this.selectLayer(layer);
		}
	}
	
	addNewLayer(event: Event) {
		// TODO:
		// const map = this.tilemap;
		// const data = [];
		// for (let y = 0; y < map.mapHeight; y++) {
		// 	data[y] = [];
		// 	for (let x = 0; x < map.mapWidth; x++) {
		// 		data[y][x] = 0;
		// 	}
		// }
		// const layer = new CCMapLayer(Globals.scene, Globals.game, {
		// 	type: 'Background',
		// 	name: this.newLayerName,
		// 	level: 0,
		// 	width: map.mapWidth,
		// 	height: map.mapHeight,
		// 	visible: 1,
		// 	tilesetName: '',
		// 	repeat: false,
		// 	distance: 1,
		// 	tilesize: Globals.TILE_SIZE,
		// 	moveSpeed: {x: 0, y: 0},
		// 	data: data,
		// });
		// console.log(layer);
		// map.addLayer(layer);
		// this.newLayerName = '';
		// this.stateHistory.saveState({
		// 	name: 'Layer added',
		// 	icon: 'add'
		// }, true);
	}
	
	deleteSelected() {
		const layer = this.selectedLayer;
		if (!layer) {
			throw new Error('no layer selected');
		}
		if (!this.tilemap) {
			throw new Error('no tilemap defined');
		}
		this.tilemap.removeLayer(layer);
		this.stateHistory.saveState({
			name: 'Layer deleted',
			icon: 'delete'
		}, true);
		
		this.selectLayer(undefined);
	}
	
	selectLayer(layer?: CCMapLayer) {
		// TODO
		// if (layer) {
		// 	layer.visible = true;
		// }
		this.mapLoader.selectedLayer.next(layer);
	}
	
	updateTilesetName(name: string) {
		if (!this.selectedLayer) {
			throw new Error('no layer selected');
		}
		this.selectedLayer.updateTileset(name);
		this.mapLoader.selectedLayer.next(this.selectedLayer);
	}
	
	updateLevel(level: number) {
		if (!this.selectedLayer) {
			throw new Error('no layer selected');
		}
		this.selectedLayer.updateLevel(level);
	}
	
	drop(event: CdkDragDrop<string[]>) {
		if (event.previousIndex === event.currentIndex) {
			return;
		}
		if (!this.tilemap) {
			throw new Error('tilemap not defined');
		}
		moveItemInArray(this.tilemap.layers, event.previousIndex, event.currentIndex);
		this.stateHistory.saveState({
			name: 'Layer moved',
			icon: 'open_with',
		}, true);
	}
	
}
