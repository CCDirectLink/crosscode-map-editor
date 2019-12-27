export enum BasePath {
	MAPS = 'data/maps/',
	ROOT = ''
}

export enum FileExtension {
	PNG = '.png',
	JSON = '.json',
	OGG = '.ogg'
}

export class PathResolver {
	
	/**
	 * @param base The path in relation to assets.
	 * @param name The name of the asset in relation to base using '.' as separator.
	 * @param extension
	 */
	public static convertToPath(base: BasePath, name: string, extension: FileExtension) {
		return base + name.replace(/\./g, '/') + extension;
	}
}
