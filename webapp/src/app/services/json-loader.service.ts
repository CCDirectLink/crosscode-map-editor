import { Injectable, inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root',
})
export class JsonLoaderService {
	private http = inject(HttpClientService);
	private angularHttp = inject(HttpClient);
	private snackbar = inject(MatSnackBar);

	private readonly initialized?: Promise<void>;
	private configs = new Map<string, unknown[]>();

	private cache: Record<string, unknown> = {};

	constructor() {
		this.initialized = this.init();
	}

	async init() {
		const configs = await this.http.getModMapEditorConfigs();

		for (const config of configs) {
			let parsedFile: unknown;
			try {
				parsedFile = JSON.parse(config.file);
			} catch (e) {
				console.error(e);
				this.snackbar.open(
					`Failed to parse mod config: ${config.mod}/map-editor/${config.filename}`,
					'close',
					{ panelClass: 'snackbar-error' },
				);
				continue;
			}
			const configs = this.configs.get(config.filename) ?? [];
			this.configs.set(config.filename, configs);
			configs.push(parsedFile);
		}
	}

	async loadJson<T>(file: string): Promise<T[]> {
		await this.initialized;
		const json = await lastValueFrom(
			this.angularHttp.get(`./assets/${file}`),
		);
		const modJson = (this.configs.get(file) ?? []) as T[];

		return [json as T, ...modJson];
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
