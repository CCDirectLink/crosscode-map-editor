import { Subscription } from 'rxjs';
import { CrossCodeMap } from '../models/cross-code-map';
import { HttpClientService } from '../services/http-client.service';
import { MapLoaderService } from '../services/map-loader.service';
import { BasePath, FileExtension, PathResolver } from '../services/path-resolver';
import { CCMap } from '../services/phaser/tilemap/cc-map';

export class TestHelper {
	// TODO: shouldn't be used because it relies on backend and original crosscode maps. Instead make custom maps for testing
	public static async loadMap(service: MapLoaderService, http: HttpClientService, mapName: string): Promise<{ imported: CrossCodeMap, ccmap: CCMap }> {
		return new Promise(((res) => {
			let imported: CrossCodeMap;
			let sub: Subscription;
			// eslint-disable-next-line prefer-const
			sub = service.tileMap.subscribe(map => {
				if (!map) {
					return;
				}
				
				// TODO: sometimes undefined
				sub!.unsubscribe();
				res({imported: imported, ccmap: map});
			});
			
			console.log('load by name: ' + mapName);
			
			const path = PathResolver.convertToPath(BasePath.MAPS, mapName, FileExtension.JSON);
			
			http.getAssetsFile<CrossCodeMap>(path).subscribe(map => {
				imported = JSON.parse(JSON.stringify(map));
				service.loadRawMap(map, mapName, path);
			});
		}));
	}
}
