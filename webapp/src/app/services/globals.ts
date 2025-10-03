import { StateHistoryService } from '../components/dialogs/floating-window/history/state-history.service';
import { AutotileService } from './autotile/autotile.service';
import { GlobalEventsService } from './global-events.service';
import { HttpClientService } from './http-client.service';
import { MapLoaderService } from './map-loader.service';
import { EntityRegistryService } from './phaser/entities/registry/entity-registry.service';
import { PhaserEventsService } from './phaser/phaser-events.service';
import { CCMap } from './phaser/tilemap/cc-map';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from './settings.service';
import { signal } from '@angular/core';
import { GridSettings } from '../components/toolbar/grid-menu/grid-menu.component';
import { JsonLoaderService } from './json-loader.service';

export class Globals {
	static isElectron = false;
	static panning = false;
	static game: Phaser.Game;
	static scene: Phaser.Scene;
	static map: CCMap;
	static TILE_SIZE = 16;
	static URL = 'http://localhost:8080/';
	static gridSettings = signal<GridSettings>({
		size: { x: 8, y: 8 },
		offset: { x: 0, y: 0 },
		color: '#222222',
		enableGrid: false,
	});
	static disablePhaserInput = new Set<any>();

	static stateHistoryService: StateHistoryService;
	static mapLoaderService: MapLoaderService;
	static globalEventsService: GlobalEventsService;
	static phaserEventsService: PhaserEventsService;
	static autotileService: AutotileService;
	static entityRegistry: EntityRegistryService;
	static httpService: HttpClientService;
	static settingsService: SettingsService;
	static snackbar: MatSnackBar;
	static jsonLoader: JsonLoaderService;
}
