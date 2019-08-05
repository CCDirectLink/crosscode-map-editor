import {Component, ElementRef, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader.service';
import {GlobalEventsService} from '../../renderer/global-events.service';
import {Globals} from '../../renderer/globals';
import {HttpService} from '../../services/http.service';
import {StateHistoryService} from '../../history/state-history.service';
import {PhaserEventsService} from '../../renderer/phaser/phaser-events.service';
import {HeightMapGeneratorService} from '../../services/height-map-generator.service';
import * as Phaser from 'phaser';
import {MainScene} from '../../renderer/phaser/main-scene';
import { CommonService } from '../../services/common.service';

@Component({
	selector: 'app-phaser',
	templateUrl: './phaser.component.html',
	styleUrls: ['./phaser.component.scss']
})
export class PhaserComponent implements OnInit {
	
	constructor(private element: ElementRef,
	            private mapLoader: LoaderService,
	            private globalEvents: GlobalEventsService,
	            private stateHistory: StateHistoryService,
	            private phaserEventsService: PhaserEventsService,
	            private common: CommonService,
	            private heightGenerator: HeightMapGeneratorService
	) {
		Globals.stateHistoryService = stateHistory;
		Globals.mapLoaderService = mapLoader;
		Globals.phaserEventsService = phaserEventsService;
		Globals.globalEventsService = globalEvents;
	}
	
	
	ngOnInit() {
		this.common.getAllFiles().subscribe(res => {
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
