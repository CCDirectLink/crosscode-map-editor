import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CCMap} from '../../renderer/phaser/tilemap/cc-map';
import {CCMapLayer} from '../../renderer/phaser/tilemap/cc-map-layer';
import {LoaderService} from '../../services/loader.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {StateHistoryService} from '../../history/state-history.service';
import { EventService } from '../../services/event.service';
import { SettingsService } from '../../services/settings.service';

@Component({
	selector: 'app-layers',
	templateUrl: './layers.component.html',
	styleUrls: ['./layers.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LayersComponent implements OnInit {
	
	selectedLayer?: CCMapLayer;
	map?: CCMap;
	newLayerName = '';
	
	constructor(private mapLoader: LoaderService,
				private stateHistory: StateHistoryService,
				private settings: SettingsService,
	            events: EventService) {
		events.toggleVisibility.subscribe(() => {
			if (this.selectedLayer) {
				this.toggleVisibility({
					stopPropagation: () => {
					}
				} as Event, this.selectedLayer);
			}
		});
	}
	
	ngOnInit() {
		this.mapLoader.selectedLayer.subscribe(layer => this.selectedLayer = layer);
		this.mapLoader.tileMap.subscribe(tilemap => this.map = tilemap);
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
		if (!this.map) {
			return;
		}
		const map = this.map;
		const tilemap = map.getTilemap();
		
		if (!tilemap) {
			return;
		}
		
		const data: number[][] = [];
		for (let y = 0; y < map.data.mapHeight; y++) {
			data[y] = [];
			for (let x = 0; x < map.data.mapWidth; x++) {
				data[y][x] = 0;
			}
		}
		const layer = new CCMapLayer(this.settings.scene, tilemap, {
			type: 'Background',
			name: this.newLayerName,
			level: 0,
			width: map.data.mapWidth,
			height: map.data.mapHeight,
			visible: 1,
			tilesetName: '',
			repeat: false,
			distance: 1,
			tilesize: this.settings.TILE_SIZE,
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
		if (!layer) {
			throw new Error('no layer selected');
		}
		if (!this.map) {
			throw new Error('no tilemap defined');
		}
		this.map.removeLayer(layer);
		this.stateHistory.saveState({
			name: 'Layer deleted',
			icon: 'delete'
		}, true);
		
		this.selectLayer(undefined);
	}
	
	selectLayer(layer?: CCMapLayer) {
		if (layer) {
			layer.visible = true;
		}
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
		if (!this.map) {
			throw new Error('tilemap not defined');
		}
		moveItemInArray(this.map.layers, event.previousIndex, event.currentIndex);
		this.stateHistory.saveState({
			name: 'Layer moved',
			icon: 'open_with',
		}, true);
	}
	
}
