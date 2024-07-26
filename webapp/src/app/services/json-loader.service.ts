import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ConfigExtension } from 'cc-map-editor-common/dist/controllers/api';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class JsonLoaderService {
	
	private readonly initialized?: Promise<void>;
	private configs = new Map<string, ConfigExtension<unknown>[]>;
	
	private cache: Record<string, unknown> = {};
	
	constructor(
		private http: HttpClientService,
		private angularHttp: HttpClient,
		private snackbar: MatSnackBar,
	) {
		this.initialized = this.init();
	}
	
	async init() {
		const configs = await this.http.getModMapEditorConfigs();
		
		for (const config of configs) {
			const newConfig: ConfigExtension<any> = {
				filename: config.filename,
				mod: config.mod,
				file: {},
			};
			try {
				newConfig.file = JSON.parse(config.file);
			} catch (e) {
				console.error(e);
				this.snackbar.open(
					`Failed to parse mod config: ${config.mod}/map-editor/${config.filename}`,
					'close',
					{panelClass: 'snackbar-error'}
				);
				continue;
			}
			const configs = this.configs.get(config.filename) ?? [];
			this.configs.set(config.filename, configs);
			configs.push(newConfig);
		}
	}
	
	async loadJson<T>(file: string): Promise<T[]> {
		await this.initialized;
		const json = await lastValueFrom(this.angularHttp.get(`./assets/${file}`));
		const modJson = (this.configs.get(file) ?? []).map(v => v.file) as T[];
		
		return [
			json as T,
			...modJson
		];
	}
	
	async loadJsonMerged<T>(file: string): Promise<T> {
		const cached = this.cache[file] as T | undefined;
		if (cached) {
			return cached;
		}
		const jsons = await this.loadJson(file);
		const base = {} as T;
		Object.assign(base as any, ...jsons);
		this.cache[file] = base;
		return base;
	}
	
	loadJsonMergedSync<T>(file: string): T {
		const cached = this.cache[file] as T | undefined;
		if (cached) {
			return cached;
		}
		throw new Error('Tried to get json synchronous, but its not loaded');
	}
}
