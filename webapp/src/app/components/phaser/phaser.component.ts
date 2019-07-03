import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {MapLoaderService} from '../../shared/map-loader.service';
import {GlobalEventsService} from '../../shared/global-events.service';
import {Globals} from '../../shared/globals';
import {HttpClientService} from '../../services/http-client.service';
import {StateHistoryService} from '../../shared/history/state-history.service';
import {PhaserEventsService} from '../../shared/phaser/phaser-events.service';
import {HeightMapGeneratorService} from '../../services/height-map-generator.service';
import {SelectedTile} from '../../models/tile-selector';
import * as Phaser from 'phaser';
import {MainScene} from '../../shared/phaser/main-scene';
import {TileDrawer} from '../../shared/phaser/tilemap/tile-drawer';

@Component({
	selector: 'app-phaser',
	templateUrl: './phaser.component.html',
	styleUrls: ['./phaser.component.scss']
})
export class PhaserComponent implements OnInit {
	// TODO
	// tileMap: CCMap;
	
	@Input()
	set selected(value: SelectedTile) {
		// TODO
		// if (this.tileDrawer) {
		// 	this.tileDrawer.select(value);
		// }
	}
	
	constructor(private element: ElementRef,
	            private mapLoader: MapLoaderService,
	            private globalEvents: GlobalEventsService,
	            private stateHistory: StateHistoryService,
	            private phaserEventsService: PhaserEventsService,
	            private http: HttpClientService,
	            private heightGenerator: HeightMapGeneratorService
	) {
		Globals.stateHistoryService = stateHistory;
		Globals.mapLoaderService = mapLoader;
		Globals.phaserEventsService = phaserEventsService;
		Globals.globalEventsService = globalEvents;
	}
	
	
	ngOnInit() {
		this.http.getAllFiles().subscribe(res => {
			const scene = new MainScene(res);
			const game = new Phaser.Game({
				width: window.innerWidth * window.devicePixelRatio,
				height: window.innerHeight * window.devicePixelRatio - 64,
				type: Phaser.AUTO,
				parent: 'content',
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
			Globals.game = game;
			Globals.scene = scene;
		}, err => {
			this.globalEvents.loadComplete.error(err);
		});
	}
}
