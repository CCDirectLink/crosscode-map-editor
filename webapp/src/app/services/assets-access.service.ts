import { inject, Service, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DBSchema, openDB } from 'idb';

interface EditorDB extends DBSchema {
	handles: {
		key: string;
		value: FileSystemDirectoryHandle;
	};
}

export interface AssetFile {
	path: string;
	handle: FileSystemFileHandle;
}

const ASSETS_KEY = 'assets';

@Service()
export class AssetsAccessService {
	
	private readonly snackBar = inject(MatSnackBar);
	
	private readonly assetsHandle = signal<FileSystemDirectoryHandle | undefined>(undefined);
	readonly handle = this.assetsHandle.asReadonly();
	
	private readonly db = openDB<EditorDB>('cc-map-editor', 1, {
		upgrade: db => db.createObjectStore('handles'),
	});
	
	async setHandle(handle: FileSystemDirectoryHandle) {
		this.assetsHandle.set(handle);
		const db = await this.db;
		await db.put('handles', handle, ASSETS_KEY);
	}
	
	async init() {
		try {
			const db = await this.db;
			const handle = await db.get('handles', ASSETS_KEY);
			if (handle) {
				this.assetsHandle.set(handle);
				this.checkPermission(handle).catch(e => console.error('Failed to check assets folder permission', e));
			}
		} catch (e) {
			console.error('Failed to restore assets folder handle', e);
		}
	}
	
	async getAllMaps(): Promise<AssetFile[]> {
		const folder = 'data/maps';
		return await this.listFiles(folder, '.json');
	}
	
	async getAllTilesets(): Promise<string[]> {
		const files = await this.listFiles('media/map', '.png');
		return files.map(file => file.path).sort();
	}
	
	/**
	 * @returns paths how the game files use them. e.g. 'dungeon/ar' for 'data/props/dungeon/ar.json'
	 */
	async getAllFilesInFolder(folder: string, extension = '.json'): Promise<string[]> {
		const files = await this.listFiles(folder, extension);
		return files
			.map(file => file.path.substring(folder.length + 1, file.path.length - extension.length))
			.sort();
	}
	
	async getFile(path: string): Promise<AssetFile> {
		const separator = path.lastIndexOf('/');
		const dir = await this.getDirectory(path.substring(0, separator));
		const handle = await dir.getFileHandle(path.substring(separator + 1));
		return { path, handle };
	}
	
	private async getDirectory(path: string) {
		let dir = this.assetsHandle()!;
		for (const name of path.split('/').filter(Boolean)) {
			dir = await dir.getDirectoryHandle(name);
		}
		return dir;
	}
	
	private async listFiles(path: string, extension: string): Promise<AssetFile[]> {
		const dir = await this.getDirectory(path);
		const files: AssetFile[] = [];
		const subDirs: Promise<AssetFile[]>[] = [];
		for await (const entry of dir.values()) {
			const entryPath = `${path}/${entry.name}`;
			if (entry.kind === 'directory') {
				subDirs.push(this.listFiles(entryPath, extension));
			} else if (entry.name.toLowerCase().endsWith(extension)) {
				files.push({ path: entryPath, handle: entry });
			}
		}
		return files.concat(...await Promise.all(subDirs));
	}
	
	private async checkPermission(handle: FileSystemDirectoryHandle) {
		if (await handle.queryPermission({ mode: 'readwrite' }) === 'granted') {
			return;
		}
		this.snackBar.open(`Access to the assets folder "${handle.name}" has to be granted`, 'Grant access')
			.onAction()
			.subscribe(() => handle.requestPermission({ mode: 'readwrite' }));
	}
}
