import { MapLoaderService } from '../shared/map-loader.service';
import { HttpClientService } from '../services/http-client.service';
import { CrossCodeMap } from '../models/cross-code-map';
import { BasePath, FileExtension, PathResolver } from '../shared/path-resolver';
import { CCMap } from '../shared/phaser/tilemap/cc-map';
import { Subscription } from 'rxjs';

export class TestHelper {
	public static async loadMap(service: MapLoaderService, http: HttpClientService, mapName: string): Promise<{ imported: CrossCodeMap, ccmap: CCMap }> {
		return new Promise(((res) => {
			let imported: CrossCodeMap;
			let sub: Subscription;
			// eslint-disable-next-line prefer-const
			sub = service.tileMap.subscribe(map => {
				if (!map) {
					return;
				}
				
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
