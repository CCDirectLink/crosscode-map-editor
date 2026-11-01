import { inject, Service, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DBSchema, openDB } from 'idb';

interface EditorDB extends DBSchema {
	handles: {
		key: string;
		value: FileSystemDirectoryHandle;
	};
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

	async getAllMaps(): Promise<string[]> {
		const folder = 'data/maps';
		const paths = await this.listFiles(folder, '.json');
		return paths
			.sort()
			.map(p => p.substring(folder.length + 1, p.length - '.json'.length).replaceAll('/', '.'));
	}

	private async getDirectory(path: string) {
		let dir = this.assetsHandle()!;
		for (const name of path.split('/').filter(Boolean)) {
			dir = await dir.getDirectoryHandle(name);
		}
		return dir;
	}

	private async listFiles(path: string, extension: string): Promise<string[]> {
		const dir = await this.getDirectory(path);
		const files: string[] = [];
		const subDirs: Promise<string[]>[] = [];
		for await (const entry of dir.values()) {
			const entryPath = `${path}/${entry.name}`;
			if (entry.kind === 'directory') {
				subDirs.push(this.listFiles(entryPath, extension));
			} else if (entry.name.toLowerCase().endsWith(extension)) {
				files.push(entryPath);
			}
		}
		return files.concat(...await Promise.all(subDirs));
	}

	private async checkPermission(handle: FileSystemDirectoryHandle) {
		if (await handle.queryPermission({ mode: 'read' }) === 'granted') {
			return;
		}
		this.snackBar.open(`Access to the assets folder "${handle.name}" has to be granted`, 'Grant access')
			.onAction()
			.subscribe(() => handle.requestPermission({ mode: 'read' }));
	}
}
