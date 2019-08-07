import { Component, ElementRef, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { HttpService } from '../../services/http.service';
import { StateHistoryService } from '../../history/state-history.service';
import { HeightMapGeneratorService } from '../../services/height-map-generator.service';
import * as Phaser from 'phaser';
import { MainScene } from '../../renderer/phaser/main-scene';
import { CommonService } from '../../services/common.service';
import { EventService } from '../../services/event.service';
import { SettingsService } from '../../services/settings.service';

@Component({
	selector: 'app-phaser',
	templateUrl: './phaser.component.html',
	styleUrls: ['./phaser.component.scss']
})
export class PhaserComponent implements OnInit {

	constructor(
		private readonly events: EventService,
		private readonly common: CommonService,
		private readonly settings: SettingsService,
		private readonly loader: LoaderService,
		private readonly stateHistory: StateHistoryService,
	) {
	}


	ngOnInit() {
		this.common.getAllFiles().subscribe(res => {
			const scene = new MainScene(res, this.settings, this.events, this.loader, this.stateHistory);
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
			this.settings.scene = scene;
		}, err => {
			this.events.loadComplete.error(err);
		});
	}
}
