import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as Phaser from 'phaser';

import { AutotileService } from '../../services/autotile/autotile.service';
import { GlobalEventsService } from '../../services/global-events.service';
import { Globals } from '../../services/globals';
import { HeightMapService } from '../../services/height-map/height-map.service';
import { HttpClientService } from '../../services/http-client.service';
import { MapLoaderService } from '../../services/map-loader.service';
import { EntityRegistryService } from '../../services/phaser/entities/registry/entity-registry.service';
import { MainScene } from '../../services/phaser/main-scene';
import { PhaserEventsService } from '../../services/phaser/phaser-events.service';
import { StateHistoryService } from '../dialogs/floating-window/history/state-history.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-phaser',
	templateUrl: './phaser.component.html',
	styleUrls: ['./phaser.component.scss']
})
export class PhaserComponent implements AfterViewInit {
	
	@ViewChild('content', {static: true}) content!: ElementRef<HTMLElement>;
	
	constructor(
		private element: ElementRef,
		private mapLoader: MapLoaderService,
		private globalEvents: GlobalEventsService,
		private stateHistory: StateHistoryService,
		private phaserEventsService: PhaserEventsService,
		private heightMap: HeightMapService,
		private http: HttpClientService,
		snackbar: MatSnackBar,
		registry: EntityRegistryService,
		autotile: AutotileService
	) {
		Globals.stateHistoryService = stateHistory;
		Globals.mapLoaderService = mapLoader;
		Globals.phaserEventsService = phaserEventsService;
		Globals.globalEventsService = globalEvents;
		Globals.autotileService = autotile;
		Globals.entityRegistry = registry;
		Globals.httpService = http;
		Globals.snackbar = snackbar;
	}
	
	
	ngAfterViewInit() {
		this.heightMap.init();
		const scene = new MainScene();
		const scale = this.getScale();
		Globals.game = new Phaser.Game({
			width: scale.width,
			height: scale.height,
			type: Phaser.AUTO,
			parent: 'content',
			scale: {
				mode: Phaser.Scale.ScaleModes.NONE,
				zoom: 1 / window.devicePixelRatio
			},
			render: {
				antialiasGL: false,
				pixelArt: true
			},
			zoom: 1,
			scene: [scene]
		});
		Globals.scene = scene;
	}
	
	@HostListener('window:resize', ['$event'])
	onResize() {
		if (!Globals.game) {
			return;
		}
		const scale = this.getScale();
		Globals.game.scale.resize(
			scale.width,
			scale.height
		);
	}
	
	private getScale() {
		const rect = this.content.nativeElement.getBoundingClientRect();
		return {
			width: rect.width * window.devicePixelRatio,
			height: rect.height * window.devicePixelRatio
		};
	}
}
