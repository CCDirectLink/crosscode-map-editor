import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { CrossCodeMap } from '../models/cross-code-map';
import { ElectronService } from './electron.service';
import { Globals } from './globals';
import { HttpClientService } from './http-client.service';
import { BasePath, FileExtension, PathResolver } from './path-resolver';
import { CCMap } from './phaser/tilemap/cc-map';
import { CCMapLayer } from './phaser/tilemap/cc-map-layer';

@Injectable({
	providedIn: 'root',
})
export class MapLoaderService {
	private snackBar = inject(MatSnackBar);
	private http = inject(HttpClientService);
	private electron = inject(ElectronService);

	tileMap = new BehaviorSubject<CCMap | undefined>(undefined);
	selectedLayer = new BehaviorSubject<CCMapLayer | undefined>(undefined);

	private _map = new BehaviorSubject<CrossCodeMap>(undefined as any);
	get map(): Observable<CrossCodeMap> {
		return this._map.asObservable();
	}

	loadMap(event: Event) {
		const files: FileList = (event.target as HTMLInputElement).files!;
		if (files.length === 0) {
			return;
		}

		const file = files[0];
		const reader = new FileReader();
		reader.onload = async (e: any) => {
			try {
				const map = JSON.parse(e.target.result) as CrossCodeMap;
				let path: string | undefined;
				if (file && Globals.isElectron) {
					const { webUtils } = await import('electron');
					const filePath = webUtils.getPathForFile(file);
					path = filePath.split(this.electron.getAssetsPath())[1];
				}
				this.loadRawMap(map, file.name, path);
			} catch (e: any) {
				console.error(e);
				this.snackBar.open('Error: ' + e.message, undefined, {
					duration: 2500,
					panelClass: 'snackbar-error',
				});
				return;
			}
		};

		reader.readAsText(file);
	}

	loadRawMap(map: CrossCodeMap, name?: string, path?: string) {
		if (!map.mapHeight) {
			throw new Error('Invalid map');
		}
		map.filename = name;
		map.path = path;
		this._map.next(map);
	}

	loadMapByName(name: string) {
		const path = PathResolver.convertToPath(
			BasePath.MAPS,
			name,
			FileExtension.JSON,
		);
		const filename = PathResolver.convertToFileName(name);

		this.http.getAssetsFile<CrossCodeMap>(path).subscribe((map) => {
			this.loadRawMap(map, filename, path);
		});
	}
}
