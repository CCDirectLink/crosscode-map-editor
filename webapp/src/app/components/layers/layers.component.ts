import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { GlobalEventsService } from '../../services/global-events.service';
import { Globals } from '../../services/globals';
import { HttpClientService } from '../../services/http-client.service';
import { MapLoaderService } from '../../services/map-loader.service';
import { CCMap } from '../../services/phaser/tilemap/cc-map';
import { CCMapLayer } from '../../services/phaser/tilemap/cc-map-layer';
import { StateHistoryService } from '../dialogs/floating-window/history/state-history.service';

@Component({
	selector: 'app-layers',
	templateUrl: './layers.component.html',
	styleUrls: ['./layers.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LayersComponent implements OnInit {
	static tilesets: string[] = []; //Cache
	
	selectedLayer?: CCMapLayer;
	map?: CCMap;
	newLayerName = '';
	tilesets: string[] = []; //Angular view data
	
	constructor(private mapLoader: MapLoaderService,
				private stateHistory: StateHistoryService,
				private http: HttpClientService,
				events: GlobalEventsService) {
		events.toggleVisibility.subscribe(() => {
			if (this.selectedLayer) {
				this.toggleVisibility({
					stopPropagation: () => {
					}
				} as Event, this.selectedLayer);
			}
		});

		this.loadTilesets();
	}
	
	ngOnInit() {
		this.mapLoader.selectedLayer.subscribe(layer => this.selectedLayer = layer);
		this.mapLoader.tileMap.subscribe(tilemap => this.map = tilemap);
	}
	
	getDisplayName(layer: CCMapLayer): string {
		return `${layer.details.name} (${layer.details.levelName ?? layer.details.level})`;
	}
	
	toggleVisibility(event: Event, layer: CCMapLayer) {
		event.stopPropagation();
		layer.visible = !layer.visible;
		if (layer.visible) {
			this.selectLayer(layer);
		}
	}
	
	async addNewLayer() {
		if (!this.map) {
			return;
		}
		const map = this.map;
		const tilemap = map.getTilemap();
		
		if (!tilemap) {
			return;
		}
		
		const data: number[][] = [];
		for (let y = 0; y < map.mapHeight; y++) {
			data[y] = [];
			for (let x = 0; x < map.mapWidth; x++) {
				data[y][x] = 0;
			}
		}
		const layer = new CCMapLayer(tilemap);
		await layer.init({
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

	getTilesetName(path: string): string {
		return path.substring('media/map/'.length, path.length - '.png'.length);
	}

	private async loadTilesets() {
		if (LayersComponent.tilesets.length > 0) {
			this.tilesets = LayersComponent.tilesets;
			return;
		}

		LayersComponent.tilesets = await firstValueFrom(this.http.getAllTilesets());
		this.tilesets = LayersComponent.tilesets;
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
