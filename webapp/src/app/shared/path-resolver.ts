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
	 * @param base The path in relation to assets.
	 * @param name The name of the asset in relation to base using '.' as separator.
	 * @param extension
	 */
	public static convertToPath(base: BasePath, name: string, extension: FileExtension) {
		return base + name.replace(/\./g, '/') + extension;
	}

	public static convertToFileName(name: string) {
		const split = name.split('.');
		return split[split.length - 1] + '.json';
	}
}
