import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetsAccessService } from './assets-access.service';

@Injectable({
	providedIn: 'root',
})
export class JsonLoaderService {
	private assets = inject(AssetsAccessService);
	private angularHttp = inject(HttpClient);
	private snackbar = inject(MatSnackBar);
	
	private readonly initialized?: Promise<void>;
	private configs = new Map<string, unknown[]>;
	readonly modConfigError = signal<{ mod?: string, message: string } | undefined>(undefined);
	
	private cache: Record<string, unknown> = {};
	private promiseCache: Record<string, Promise<unknown>> = {};
	private gameJsons: Record<string, Promise<unknown> | undefined> = {};
	private images: Record<string, Promise<HTMLImageElement | undefined> | undefined> = {};
	
	constructor() {
		this.initialized = this.init();
	}
	
	async init() {
		await this.assets.ready;
		const configs = await this.assets.getModMapEditorConfigs();
		
		// they start with the highest priority, but a later json overrides the ones before it
		for (const config of configs.reverse()) {
			let parsedFile: unknown;
			try {
				parsedFile = JSON.parse(await (await config.handle.getFile()).text());
			} catch (e) {
				this.modConfigError.set({ mod: config.mod?.id, message: `Failed to parse ${config.path}\n${e}` });
				this.snackbar.open(
					`Failed to parse mod config: ${config.mod?.id}/${config.path}`,
					'close',
					{ panelClass: 'snackbar-error' },
				);
				throw e;
			}
			const configs = this.configs.get(config.handle.name) ?? [];
			this.configs.set(config.handle.name, configs);
			configs.push(parsedFile);
		}
	}
	
	async loadJson<T>(file: string): Promise<T[]> {
		const json = lastValueFrom(this.angularHttp.get(`./assets/${file}`));
		await this.initialized;
		const modJson = (this.configs.get(file) ?? []) as T[];
		
		return [
			await json as T,
			...modJson,
		];
	}
	
	loadJsonMerged<T>(file: string): Promise<T> {
		const cachedPromise = this.promiseCache[file] as Promise<T> | undefined;
		if (cachedPromise) {
			return cachedPromise;
		}
		const promise = this.loadJson<T>(file).then(jsons => {
			const base = {} as T;
			Object.assign(base as any, ...jsons);
			this.cache[file] = base;
			return base;
		});
		this.promiseCache[file] = promise;
		return promise;
	}
	
	loadJsonMergedSync<T>(file: string): T {
		const cached = this.cache[file] as T | undefined;
		if (cached) {
			return cached;
		}
		throw new Error('Tried to get json synchronous, but its not loaded');
	}
	
	loadGameJson(path: string): Promise<unknown> {
		return this.gameJsons[path] ??= this.readGameJson(path);
	}
	
	async loadTexture(path: string, scene: Phaser.Scene): Promise<boolean> {
		// check phaser cache first for images loaded outside of this service 
		if (scene.textures.exists(path)) {
			return true;
		}
		
		const img = await (this.images[path] ??= this.readImage(path));
		if (!img) {
			return false;
		}
		// another call might have added the same texture while this one was loading
		if (!scene.textures.exists(path)) {
			scene.textures.addImage(path, img);
		}
		return true;
	}
	
	private async readGameJson(path: string): Promise<unknown> {
		try {
			const file = await this.assets.getFile(path);
			if (file) {
				return JSON.parse(await (await file.handle.getFile()).text());
			}
			console.warn(`Resource not found: ${path}`);
		} catch (e) {
			console.warn(`Failed to resolve resource: ${path}`, e);
		}
		return undefined;
	}
	
	private async readImage(path: string): Promise<HTMLImageElement | undefined> {
		try {
			const file = await this.assets.getFile(path);
			if (!file) {
				return undefined;
			}
			const url = URL.createObjectURL(await file.handle.getFile());
			const img = new Image();
			img.src = url;
			await img.decode().finally(() => URL.revokeObjectURL(url));
			return img;
		} catch {
			return undefined;
		}
	}
}
