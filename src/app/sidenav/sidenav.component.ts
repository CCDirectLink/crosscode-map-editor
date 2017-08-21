import {AfterViewInit, Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MdSidenav} from '@angular/material';
import {MapLoaderService} from '../shared/map-loader.service';
import {MapLayer} from '../shared/interfaces/cross-code-map';

@Component({
	selector: 'app-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

	layers: Phaser.TilemapLayer[] = <any>[
		{crossCode: {name: 'Layer1', level: '1', type: 'Collision'}},
	];

	constructor(private mapLoader: MapLoaderService) {
	}

	ngOnInit() {
		this.mapLoader.layers.subscribe((layers) => {
			console.log(layers);
			if (layers) {
				this.layers = layers;
			} else {
				this.layers = null;
			}
		});
	}

	getDisplayName(layer: Phaser.TilemapLayer): string {
		return `${layer.crossCode.name} (${layer.crossCode.level})`;
	}

	toggleVisibility(event, layer: Phaser.TilemapLayer) {
		layer.visible = !layer.visible;
	}

	selectLayer(layer: Phaser.TilemapLayer) {

	}

	debug(input) {
		console.log(input);
	}

}
