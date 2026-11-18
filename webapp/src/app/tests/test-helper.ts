import { TestBed } from '@angular/core/testing';
import { firstValueFrom, skip } from 'rxjs';
import { CrossCodeMap } from '../models/cross-code-map';
import { AssetsAccessService } from '../services/assets-access.service';
import { MapLoaderService } from '../services/map-loader.service';
import { CCMap } from '../services/phaser/tilemap/cc-map';

export class TestHelper {
	// the editor waits for an assets folder before it loads anything, tests use an empty one
	public static async initAssets() {
		const assets = TestBed.inject(AssetsAccessService);
		await assets.setHandle(await navigator.storage.getDirectory());
		await assets.ready;
	}
	
	public static async loadMap(service: MapLoaderService, map: CrossCodeMap): Promise<{ imported: CrossCodeMap, ccmap: CCMap }> {
		// needs to wait for the map to actually load
		const loaded = firstValueFrom(service.tileMap.pipe(skip(1)));
		await service.loadRawMap(JSON.parse(JSON.stringify(map)));
		return { imported: map, ccmap: (await loaded)! };
	}
}
