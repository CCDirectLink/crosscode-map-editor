import { computed, inject, resource, Service, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DBSchema, openDB } from 'idb';
import { Label } from '../models/events';
import { AssetSource, AssetSources } from './asset-sources';
import { DirectoryHandleCache } from './directory-handle-cache';
import { SettingsService } from './settings.service';

interface EditorDB extends DBSchema {
	handles: {
		key: string;
		value: FileSystemDirectoryHandle;
	};
}

export interface AssetFile {
	path: string;
	handle: FileSystemFileHandle;
	mod?: ModInfo;
	overrides?: boolean;
	overridden?: boolean;
}

export interface ModInfo {
	id: string;
	displayName: string;
	assets?: DirectoryHandleCache;
	root?: DirectoryHandleCache;
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
	private readonly settings = inject(SettingsService);
	
	private readonly assetsHandle = signal<FileSystemDirectoryHandle | undefined>(undefined);
	private readonly hasAccess = signal(false);
	readonly handle = this.assetsHandle.asReadonly();
	
	// when the user gave permission to the assets folder
	private readonly grantedHandle = computed(() => this.hasAccess() ? this.assetsHandle() : undefined);
	
	private readonly directories = computed(() => {
		const root = this.assetsHandle();
		return root && new DirectoryHandleCache(root);
	});
	
	private _allMods = resource({
		params: () => this.grantedHandle(),
		loader: async () => {
			try {
				const [mods, dlcs] = await Promise.all([
					this.readAllMods(ModType.MOD),
					this.readAllMods(ModType.DLC),
				]);
				return [...mods, ...dlcs];
			} catch (e) {
				console.error('Failed to load mods', e);
				this.snackBar.open('failed to load mods', 'ok', { panelClass: 'snackbar-error' });
				throw e;
			}
		},
		defaultValue: [],
	});
	
	public readonly allMods = this._allMods.asReadonly();
	
	public readonly activeMods = computed(() => {
		const allMods = this.allMods.value();
		const settings = this.settings.signalSettings();
		const selectedMods = new Set(settings.selectedMods().concat(settings.selectedDlcs()));
		return allMods.filter(mod => selectedMods.has(mod.id));
	});
	
	// priority is mod > dlc > base game, activeMods has the mods before the DLCs
	private readonly sources = computed(() => {
		const sources: AssetSource[] = [];
		for (const mod of this.activeMods()) {
			if (mod.assets) {
				sources.push({ directories: mod.assets, mod });
			}
		}
		const base = this.directories();
		if (base) {
			sources.push({ directories: base });
		}
		return new AssetSources(sources);
	});
	
	// ready when all mods are loaded
	public readonly accessibleHandle = computed(() => {
		if (this.allMods.status() === 'resolved') {
			return this.grantedHandle();
		}
		return undefined;
	});
	
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
		return await this.getSources().listFiles(folder, '.json', true);
	}
	
	async getAllTilesets(): Promise<string[]> {
		const files = await this.getSources().listFiles('media/map', '.png');
		return files.map(file => file.path).sort();
	}
	
	/**
	 * @returns paths how the game files use them. e.g. 'dungeon/ar' for 'data/props/dungeon/ar.json'
	 */
	async getAllFilesInFolder(folder: string, extension = '.json'): Promise<string[]> {
		const files = await this.getSources().listFiles(folder, extension);
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
		return this.getSources().getFile(path);
	}
	
	private getSources() {
		this.assertModsLoaded();
		return this.sources();
	}
	
	private assertModsLoaded() {
		if (!this.accessibleHandle()) {
			const error = new Error('Assets accessed before mods are loaded');
			console.error(error);
			throw error;
		}
	}
	
	private async getDirectory(path: string) {
		return this.directories()!.get(path);
	}
	
	private async readAllMods(modType: ModType) {
		const folders = await this.listFolders(modType);
		const out = await Promise.all(folders.map(folder => this.readModInfo(folder, modType)));
		return out.filter(v => !!v).sort(byDisplayName);
	}
	
	private async readModInfo(folder: string, modType: ModType): Promise<ModInfo | undefined> {
		const path = `${modType}/${folder}`;
		
		const dir = this.directories()!;
		
		const readManifest = async <T>(name: string): Promise<T | undefined> => {
			const handle = await dir.getFileHandle(`${path}/${name}`);
			if (!handle) {
				return undefined;
			}
			
			try {
				return JSON.parse(await (await handle.getFile()).text());
			} catch (e) {
				console.error(`Invalid json data in ${path}/${name}`, e);
				return undefined;
			}
		};
		
		const root = await dir.get(path);
		const assets = modType === ModType.DLC ? undefined : await dir.get(`${path}/assets`);
		
		const base: ModInfo = {
			id: '?',
			displayName: '?',
			type: modType,
			assets: assets ? new DirectoryHandleCache(assets) : undefined,
			root: root ? new DirectoryHandleCache(root) : undefined,
		};
		
		if (modType === ModType.DLC) {
			const manifest = await readManifest<DlcManifest>(`${folder}.json`);
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
		
		const ccmod = await readManifest<ModManifest>('ccmod.json');
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
		const pkg = await readManifest<ModManifest>('package.json');
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
