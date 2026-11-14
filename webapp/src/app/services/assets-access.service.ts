import { computed, inject, resource, Service, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DBSchema, openDB } from 'idb';
import { Label } from '../models/events';
import { DirectoryHandleCache, undefinedIfNotFound } from './directory-handle-cache';

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

export interface ModInfo {
	id: string;
	displayName: string;
	assets?: FileSystemDirectoryHandle;
	root?: FileSystemDirectoryHandle;
	dependencies?: string[];
	version?: string;
	type: ModType;
}

export enum ModType {
	MOD = 'mods',
	DLC = 'extension'
}

interface DlcManifest {
	name: Label;
}

interface ModManifest {
	id?: string;
	name?: string;
	title?: string | Label;
	displayName?: string;
	ccmodHumanName?: string;
	version?: string;
	ccmodDependencies?: Record<string, string>;
	dependencies?: Record<string, string>;
}

const ASSETS_KEY = 'assets';

function byDisplayName(a: ModInfo, b: ModInfo) {
	return a.displayName.localeCompare(b.displayName);
}

// 'dependencies' of a package.json can also be npm packages, so 'ccmodDependencies' goes first
function getDependencies(manifest: ModManifest) {
	return Object.keys(manifest.ccmodDependencies ?? manifest.dependencies ?? {});
}

@Service()
export class AssetsAccessService {
	
	private readonly snackBar = inject(MatSnackBar);
	
	private readonly assetsHandle = signal<FileSystemDirectoryHandle | undefined>(undefined);
	private readonly hasAccess = signal(false);
	readonly handle = this.assetsHandle.asReadonly();
	/** The assets handle, but only once read/write access is granted. A restored handle needs the user to grant access again. */
	readonly accessibleHandle = computed(() => this.hasAccess() ? this.assetsHandle() : undefined);
	private readonly directories = computed(() => {
		const root = this.assetsHandle();
		return root && new DirectoryHandleCache(root);
	});
	
	private _allMods = resource({
		params: () => this.accessibleHandle(),
		loader: async () => [
			...await this.readAllMods(ModType.MOD),
			...await this.readAllMods(ModType.DLC),
		],
		defaultValue: [],
	});
	
	public allMods = this._allMods.asReadonly();
	
	private readonly db = openDB<EditorDB>('cc-map-editor', 1, {
		upgrade: db => db.createObjectStore('handles'),
	});
	
	async setHandle(handle: FileSystemDirectoryHandle) {
		this.assetsHandle.set(handle);
		// the handle comes from showDirectoryPicker({ mode: 'readwrite' }), which already granted access
		this.hasAccess.set(true);
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
	
	async getModMapEditorConfigs() {
		// TODO: fs-access
		return [] as any[];
		// return lastValueFrom(this.request('api/allModMapEditorConfigs', api.getAllModMapEditorConfigs));
	}
	
	async getFile(path: string): Promise<AssetFile | undefined> {
		const separator = path.lastIndexOf('/');
		const dir = await this.getDirectory(path.substring(0, separator));
		const handle = await dir?.getFileHandle(path.substring(separator + 1)).catch(undefinedIfNotFound);
		return handle && { path, handle };
	}
	
	private async getDirectory(path: string) {
		return this.directories()!.get(path);
	}
	
	private async listFiles(path: string, extension: string): Promise<AssetFile[]> {
		const dir = await this.getDirectory(path);
		if (!dir) {
			return [];
		}
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
	
	private async readAllMods(modType: ModType) {
		const folders = await this.listFolders(modType);
		const out = await Promise.all(folders.map(folder => this.readModInfo(folder, modType)));
		return out.filter(v => !!v).sort(byDisplayName);
	}
	
	private async readModInfo(folder: string, modType: ModType): Promise<ModInfo | undefined> {
		const path = `${modType}/${folder}`;
		
		const base: ModInfo = {
			id: '?',
			displayName: '?',
			type: modType,
			assets: await this.directories()?.get(`${path}/assets`),
			root: await this.directories()?.get(path),
		};
		
		if (modType === ModType.DLC) {
			const manifest = await this.readJson<DlcManifest>(`${path}/${folder}.json`);
			if (!manifest) {
				return undefined;
			}
			return {
				...base,
				id: folder,
				displayName: manifest.name?.en_US?.trim() || folder,
				assets: base.root,
			};
		}
		
		const ccmod = await this.readJson<ModManifest>(`${path}/ccmod.json`);
		if (ccmod) {
			const id = ccmod.id ?? folder;
			const title = typeof ccmod.title === 'string' ? ccmod.title : ccmod.title?.en_US;
			return {
				...base,
				id: id,
				displayName: title ?? id,
				version: ccmod.version,
				dependencies: getDependencies(ccmod),
			};
		}
		const pkg = await this.readJson<ModManifest>(`${path}/package.json`);
		if (pkg) {
			const id = pkg.name ?? folder;
			return {
				...base,
				id: id,
				displayName: pkg.displayName ?? pkg.ccmodHumanName ?? id,
				version: pkg.version,
				dependencies: getDependencies(pkg),
			};
		}
		
		return undefined;
	}
	
	private async listFolders(path: string): Promise<string[]> {
		// an unmodded game has no 'mods' folder
		const dir = await this.getDirectory(path);
		if (!dir) {
			return [];
		}
		
		const folders: string[] = [];
		for await (const entry of dir.values()) {
			if (entry.kind === 'directory') {
				folders.push(entry.name);
			}
		}
		return folders;
	}
	
	private async readJson<T>(path: string): Promise<T | undefined> {
		const file = await this.getFile(path);
		if (!file) {
			return undefined;
		}
		
		try {
			return JSON.parse(await (await file.handle.getFile()).text());
		} catch (e) {
			console.error(`Invalid json data in ${path}`, e);
			return undefined;
		}
	}
	
	private async checkPermission(handle: FileSystemDirectoryHandle) {
		if (await handle.queryPermission({ mode: 'readwrite' }) === 'granted') {
			this.hasAccess.set(true);
			return;
		}
		this.snackBar.open(`Access to the assets folder "${handle.name}" has to be granted`, 'Grant access')
			.onAction()
			.subscribe(async () => {
				if (await handle.requestPermission({ mode: 'readwrite' }) === 'granted') {
					this.hasAccess.set(true);
				}
			});
	}
}
