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

	private async checkPermission(handle: FileSystemDirectoryHandle) {
		if (await handle.queryPermission({ mode: 'read' }) === 'granted') {
			return;
		}
		this.snackBar.open(`Access to the assets folder "${handle.name}" has to be granted`, 'Grant access')
			.onAction()
			.subscribe(() => handle.requestPermission({ mode: 'read' }));
	}
}
