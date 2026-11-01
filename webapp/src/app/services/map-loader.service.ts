import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { CrossCodeMap } from '../models/cross-code-map';
import { AssetFile, AssetsAccessService } from './assets-access.service';
import { BasePath, FileExtension, PathResolver } from './path-resolver';
import { CCMap } from './phaser/tilemap/cc-map';
import { CCMapLayer } from './phaser/tilemap/cc-map-layer';
import { GlobalEventsService } from './global-events.service';
import { OverlayService } from '../components/dialogs/overlay/overlay.service';
import { ConfirmCloseComponent } from '../components/dialogs/confirm-close/confirm-close.component';

export const MAP_FILE_TYPES: FilePickerAcceptType[] = [{
	description: 'CrossCode map',
	accept: { 'application/json': ['.json'] },
}];

export function isPickerAbort(e: unknown) {
	return e instanceof DOMException && e.name === 'AbortError';
}

@Injectable({
	providedIn: 'root',
})
export class MapLoaderService {
	private readonly snackBar = inject(MatSnackBar);
	private readonly assets = inject(AssetsAccessService);
	private readonly eventsService = inject(GlobalEventsService);
	private readonly overlayService = inject(OverlayService);
	
	tileMap = new BehaviorSubject<CCMap | undefined>(undefined);
	selectedLayer = new BehaviorSubject<CCMapLayer | undefined>(undefined);

	handle?: FileSystemFileHandle;

	private _map = new BehaviorSubject<CrossCodeMap>(undefined as any);
	get map(): Observable<CrossCodeMap> {
		return this._map.asObservable();
	}
	
	async openMap(confirm = false) {
		let handle: FileSystemFileHandle;
		try {
			[handle] = await window.showOpenFilePicker({ types: MAP_FILE_TYPES });
		} catch (e: unknown) {
			if (!isPickerAbort(e)) {
				console.error(e);
			}
			return;
		}
		await this.loadMapByFile(handle, confirm);
	}

	async loadRawMap(map: CrossCodeMap, handle?: FileSystemFileHandle, confirm = false) {
		if (!map.mapHeight) {
			throw new Error('Invalid map');
		}
		if (confirm) {
			const res = await this.showConfirmDialog();
			if (!res) {
				return;
			}
		}

		if (handle) {
			map.filename = handle.name;
		}
		this.handle = handle;
		this._map.next(map);
	}
	
	async loadMapByName(name: string, confirm = false) {
		const path = PathResolver.convertToPath(BasePath.MAPS, name, FileExtension.JSON);
		let file: AssetFile;
		try {
			file = await this.assets.getFile(path);
		} catch (e: unknown) {
			this.showLoadError(path, e);
			return;
		}
		await this.loadMapByFile(file.handle, confirm);
	}

	async loadMapByFile(handle: FileSystemFileHandle, confirm = false) {
		try {
			const content = await (await handle.getFile()).text();
			const map = JSON.parse(content) as CrossCodeMap;
			await this.loadRawMap(map, handle, confirm);
		} catch (e: unknown) {
			this.showLoadError(handle.name, e);
		}
	}

	private showLoadError(path: string, e: unknown) {
		console.error(e);
		this.snackBar.open(`failed to load map ${path}`, 'ok', { panelClass: 'snackbar-error', duration: 5000 });
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
