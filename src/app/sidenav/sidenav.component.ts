import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MapLoaderService} from '../shared/map-loader.service';
import {CrossCodeMap, MapLayer} from '../shared/interfaces/cross-code-map';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

	selectedLayer: Phaser.TilemapLayer;
	map: CrossCodeMap;
	layers: Phaser.TilemapLayer[] = <any>[
		{crossCode: {name: 'Layer1', level: '1', type: 'Collision'}},
	];

	constructor(private mapLoader: MapLoaderService) {
		this.mapLoader.selectedLayer.subscribe(layer => this.selectedLayer = layer);
		this.mapLoader.map.subscribe(map => this.map = map);
	}

	ngOnInit() {
		this.mapLoader.layers.subscribe((layers) => {
			console.log(layers);
			if (layers) {
				this.layers = layers;
			} else {
				// this.layers = null;
			}
		});
	}

	getDisplayName(layer: Phaser.TilemapLayer): string {
		return `${layer.crossCode.name} (${layer.crossCode.level})`;
	}

	toggleVisibility(event, layer: Phaser.TilemapLayer) {
		event.stopPropagation();
		layer.visible = !layer.visible;
	}

	selectLayer(layer: Phaser.TilemapLayer) {
		this.mapLoader.selectedLayer.next(layer);
		console.log('click');
	}

	debug(input) {
		console.log(input);
	}

}
