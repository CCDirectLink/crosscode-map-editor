import {Component, ElementRef, Input, isDevMode, OnDestroy, OnInit} from '@angular/core';
import {MapLoaderService} from '../../shared/map-loader.service';
import {Subscription} from 'rxjs';
import {EntityManager} from '../../shared/phaser/entities/entity-manager';
import {GlobalEventsService} from '../../shared/global-events.service';
import {EditorView} from '../../models/editor-view';
import {Globals} from '../../shared/globals';
import {HttpClientService} from '../../services/http-client.service';
import {StateHistoryService} from '../../shared/history/state-history.service';
import {PhaserEventsService} from '../../shared/phaser/phaser-events.service';
import {HeightMapGeneratorService} from '../../services/height-map-generator.service';
import {FileInfos} from '../../models/file-infos';
import {ISelectedTiles} from '../../models/tile-selector';
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
	
	// plugins
	// private mapPan: MapPan;
	// private tileDrawer: TileDrawer;
	// private entityManager: EntityManager;
	
	@Input()
	set selected(value: ISelectedTiles) {
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
	            private heightGenerator: HeightMapGeneratorService) {
	}
	
	
	ngOnInit() {
		this.http.getAllFiles().subscribe(res => {
			const scene = new MainScene(res, this.stateHistory, this.mapLoader, this.phaserEventsService, this.globalEvents);
			const tileDrawer = new TileDrawer();
			const game = new Phaser.Game({
				width: window.innerWidth * window.devicePixelRatio,
				height: window.innerHeight * window.devicePixelRatio - 64,
				type: Phaser.AUTO,
				parent: 'content',
				render: {
					antialias: false,
					roundPixels: true
				},
				scene: [scene, tileDrawer]
			});
			Globals.game = game;
			Globals.scene = scene;
		}, err => {
			this.globalEvents.loadComplete.error(err);
		});
	}
}
