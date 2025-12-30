import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import * as Phaser from 'phaser';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AutotileService } from '../../services/autotile/autotile.service';
import { GlobalEventsService } from '../../services/global-events.service';
import { Globals } from '../../services/globals';
import { HeightMapService } from '../../services/height-map/height-map.service';
import { HttpClientService } from '../../services/http-client.service';
import { MapLoaderService } from '../../services/map-loader.service';
import { EntityRegistryService } from '../../services/phaser/entities/registry/entity-registry.service';
import { MainScene } from '../../services/phaser/main-scene';
import { PhaserEventsService } from '../../services/phaser/phaser-events.service';
import { SettingsService } from '../../services/settings.service';
import { StateHistoryService } from '../dialogs/floating-window/history/state-history.service';
import { JsonLoaderService } from '../../services/json-loader.service';

@Component({
	selector: 'app-phaser',
	templateUrl: './phaser.component.html',
	styleUrls: ['./phaser.component.scss'],
	standalone: false
})
export class PhaserComponent implements AfterViewInit {
	private element = inject(ElementRef);
	private mapLoader = inject(MapLoaderService);
	private globalEvents = inject(GlobalEventsService);
	private stateHistory = inject(StateHistoryService);
	private phaserEventsService = inject(PhaserEventsService);
	private heightMap = inject(HeightMapService);
	private http = inject(HttpClientService);

	
	@ViewChild('content', {static: true}) content!: ElementRef<HTMLElement>;
	
	constructor() {
		const mapLoader = this.mapLoader;
		const globalEvents = this.globalEvents;
		const stateHistory = this.stateHistory;
		const phaserEventsService = this.phaserEventsService;
		const http = this.http;
		const snackbar = inject(MatSnackBar);
		const registry = inject(EntityRegistryService);
		const autotile = inject(AutotileService);
		const settingsService = inject(SettingsService);
		const jsonLoader = inject(JsonLoaderService);

		Globals.stateHistoryService = stateHistory;
		Globals.mapLoaderService = mapLoader;
		Globals.phaserEventsService = phaserEventsService;
		Globals.globalEventsService = globalEvents;
		Globals.autotileService = autotile;
		Globals.entityRegistry = registry;
		Globals.httpService = http;
		Globals.snackbar = snackbar;
		Globals.settingsService = settingsService;
		Globals.jsonLoader = jsonLoader;
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
	
	@HostListener('window:resize')
	onResize() {
		if (!Globals.game) {
			return;
		}
		const scale = this.getScale();
		Globals.game.scale.resize(
			scale.width,
			scale.height
		);
		Globals.game.scale.setZoom(1 / window.devicePixelRatio);
	}
	
	private getScale() {
		const rect = this.content.nativeElement.getBoundingClientRect();
		return {
			width: rect.width * window.devicePixelRatio,
			height: rect.height * window.devicePixelRatio
		};
	}
}
