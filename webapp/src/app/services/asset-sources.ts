import { AssetFile, ModInfo } from './assets-access.service';
import { DirectoryHandleCache } from './directory-handle-cache';

export interface AssetSource {
	directories: DirectoryHandleCache;
	mod?: ModInfo;
}

export class AssetSources {
	
	constructor(private readonly sources: AssetSource[]) {
	}
	
	async listFiles(path: string, extension: string, includeOverridden = false): Promise<AssetFile[]> {
		const lists = await Promise.all(this.sources.map(source => this.listSource(source, path, extension)));
		const all = lists.flat();
		if (includeOverridden) {
			return all;
		}
		const files = new Map<string, AssetFile>();
		for (const file of all) {
			if (!files.has(file.path)) {
				files.set(file.path, file);
			}
		}
		return Array.from(files.values());
	}
	
	async getFile(path: string): Promise<AssetFile | undefined> {
		const files = await Promise.all(this.sources.map(source => this.getSourceFile(source, path)));
		return files.find(file => !!file);
	}
	
	private async getSourceFile(source: AssetSource, path: string): Promise<AssetFile | undefined> {
		const handle = await source.directories.getFileHandle(path);
		return handle && { path, handle, mod: source.mod };
	}
	
	private async listSource(source: AssetSource, path: string, extension: string): Promise<AssetFile[]> {
		const dir = await source.directories.get(path);
		if (!dir) {
			return [];
		}
		const files: AssetFile[] = [];
		const subDirs: Promise<AssetFile[]>[] = [];
		for await (const entry of dir.values()) {
			const entryPath = `${path}/${entry.name}`;
			if (entry.kind === 'directory') {
				subDirs.push(this.listSource(source, entryPath, extension));
			} else if (entry.name.toLowerCase().endsWith(extension)) {
				files.push({ path: entryPath, handle: entry, mod: source.mod });
			}
		}
		return files.concat(...await Promise.all(subDirs));
	}
}
