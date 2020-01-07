import { MapContext } from '../models/cross-code-map';

export enum BasePath {
	MAPS = 'data/maps/'
}

export enum FileExtension {
	PNG = '.png',
	JSON = '.json',
	OGG = '.ogg'
}

export class PathResolver {
	
	/**
	 * @param mapContext The MapContext to use to build base path
	 * @param base The path in relation to assets.
	 * @param name The name of the asset in relation to base using '.' as separator.
	 * @param extension
	 */
	public static convertToPath(mapContext: MapContext, base: BasePath, name: string, extension: FileExtension) {
		return mapContext.path + base + name.replace(/\./g, '/') + extension;
	}
}
