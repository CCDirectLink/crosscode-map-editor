import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { CrossCodeMap } from '../models/cross-code-map';
import { ElectronService } from './electron.service';
import { Globals } from './globals';
import { HttpClientService } from './http-client.service';
import { BasePath, FileExtension, PathResolver } from './path-resolver';
import { CCMap } from './phaser/tilemap/cc-map';
import { CCMapLayer } from './phaser/tilemap/cc-map-layer';
import { GlobalEventsService } from './global-events.service';
import { OverlayService } from '../components/dialogs/overlay/overlay.service';
import { ConfirmCloseComponent } from '../components/dialogs/confirm-close/confirm-close.component';

@Injectable({
	providedIn: 'root',
})
export class MapLoaderService {
	private readonly snackBar = inject(MatSnackBar);
	private readonly http = inject(HttpClientService);
	private readonly electron = inject(ElectronService);
	private readonly eventsService = inject(GlobalEventsService);
	private readonly overlayService = inject(OverlayService);
	
	tileMap = new BehaviorSubject<CCMap | undefined>(undefined);
	selectedLayer = new BehaviorSubject<CCMapLayer | undefined>(undefined);
	
	private _map = new BehaviorSubject<CrossCodeMap>(undefined as any);
	get map(): Observable<CrossCodeMap> {
		return this._map.asObservable();
	}
	
	loadMap(event: Event, confirm = false) {
		const files: FileList = (event.target as HTMLInputElement).files!;
		if (files.length === 0) {
			return;
		}
		
		const file = files[0];
		const reader = new FileReader();
		reader.onload = (e: any) => {
			try {
				const map = JSON.parse(e.target.result);
				let path: string | undefined;
				if (file && Globals.isElectron) {
					const { webUtils } = require('electron');
					const filePath = webUtils.getPathForFile(file);
					path = filePath.split(this.electron.getAssetsPath())[1];
				}
				this.loadRawMap(map, file.name, path, confirm);
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
	
	async loadRawMap(map: CrossCodeMap, name?: string, path?: string, confirm = false) {
		if (!map.mapHeight) {
			throw new Error('Invalid map');
		}
		if (confirm) {
			const res = await this.showConfirmDialog();
			if (!res) {
				return;
			}
		}
		
		map.filename = name;
		map.path = path;
		this._map.next(map);
	}
	
	async loadMapByName(name: string, confirm = false) {
		const path = PathResolver.convertToPath(BasePath.MAPS, name, FileExtension.JSON);
		const filename = PathResolver.convertToFileName(name);
		
		try {
			const map = await firstValueFrom(this.http.getAssetsFile<CrossCodeMap>(path));
			await this.loadRawMap(map, filename, path, confirm);
		} catch (e: unknown) {
			console.error(e);
			this.snackBar.open(`failed to load map ${path}`, 'ok', { panelClass: 'snackbar-error', duration: 5000 });
		}
		
	}
	
	private async showConfirmDialog() {
		const hasUnsavedChanges = await firstValueFrom(this.eventsService.hasUnsavedChanges);
		if (!hasUnsavedChanges) {
			return true;
		}
		
		const dialogRef = this.overlayService.open(ConfirmCloseComponent, {
			hasBackdrop: true,
		});
		const result = await firstValueFrom(dialogRef.ref.onClose, { defaultValue: false });
		if (result) {
			this.eventsService.hasUnsavedChanges.next(false);
		}
		return result;
	}
}
