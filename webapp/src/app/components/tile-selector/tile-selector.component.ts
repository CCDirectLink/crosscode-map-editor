import {
	Component,
	ElementRef,
	OnInit,
	ViewChild,
	ViewEncapsulation,
	ChangeDetectorRef,
	Output,
	EventEmitter
} from '@angular/core';
import * as Phaser from 'phaser';
import {MapLoaderService} from '../../shared/map-loader.service';
import {CCMapLayer} from '../../shared/phaser/tilemap/cc-map-layer';
import {MapLayer} from '../../models/cross-code-map';
import {Globals} from '../../shared/globals';
import {Helper} from '../../shared/phaser/helper';
import {HttpClientService} from '../../services/http-client.service';
import {SelectedTile} from '../../models/tile-selector';
import {TileSelectorScene} from './tile-selector.scene';


@Component({
	selector: 'app-tile-selector',
	templateUrl: './tile-selector.component.html',
	styleUrls: ['./tile-selector.component.scss']
})
export class TileSelectorComponent implements OnInit {
	private display?: Phaser.Game;
	
	constructor(
		private mapLoader: MapLoaderService,
		private http: HttpClientService) {
	}
	
	ngOnInit() {
		const scene = new TileSelectorScene();
		this.display = new Phaser.Game({
			width: 400 * window.devicePixelRatio,
			height: 1200 * window.devicePixelRatio,
			type: Phaser.AUTO,
			parent: 'tile-selector-content',
			scale: {
				mode: Phaser.Scale.ScaleModes.NONE,
				zoom: 1 / window.devicePixelRatio
			},
			render: {
				pixelArt: true
			},
			zoom: 1,
			scene: [scene]
		});
	}
}
