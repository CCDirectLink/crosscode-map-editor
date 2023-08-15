import { StateHistoryService } from '../components/dialogs/floating-window/history/state-history.service';
import { AutotileService } from './autotile/autotile.service';
import { GlobalEventsService } from './global-events.service';
import { HttpClientService } from './http-client.service';
import { MapLoaderService } from './map-loader.service';
import { EntityRegistryService } from './phaser/entities/registry/entity-registry.service';
import { PhaserEventsService } from './phaser/phaser-events.service';
import { CCMap } from './phaser/tilemap/cc-map';
import { MatSnackBar } from '@angular/material/snack-bar';

export class Globals {
	static isElectron = false;
	static panning = false;
	static game: Phaser.Game;
	static scene: Phaser.Scene;
	static map: CCMap;
	static TILE_SIZE = 16;
	static URL = 'http://localhost:8080/';
	static entitySettings = {
		gridSize: 8,
		enableGrid: false
	};
	static disablePhaserInput = new Set<any>();
	
	// TODO: remove them from global state
	static stateHistoryService: StateHistoryService;
	static mapLoaderService: MapLoaderService;
	static globalEventsService: GlobalEventsService;
	static phaserEventsService: PhaserEventsService;
	static autotileService: AutotileService;
	static entityRegistry: EntityRegistryService;
	static httpService: HttpClientService;
	static snackbar: MatSnackBar;
}
