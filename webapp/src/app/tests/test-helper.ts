import { CrossCodeMap } from '../models/cross-code-map';
import { MapLoaderService } from '../services/map-loader.service';
import { CCMap } from '../services/phaser/tilemap/cc-map';

export class TestHelper {
	// TODO: shouldn't be used because it relies on backend and original crosscode maps. Instead make custom maps for testing
	public static async loadMap(service: MapLoaderService, http: any, mapName: string): Promise<{ imported: CrossCodeMap, ccmap: CCMap }> {
		throw new Error('should not be used');
	}
}
