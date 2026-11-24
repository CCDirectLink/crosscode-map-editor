import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventManager } from '@angular/platform-browser';
import { GlobalEventsService } from './global-events.service';
import { isPickerAbort, MAP_FILE_TYPES, MapLoaderService } from './map-loader.service';
import { Helper } from './phaser/helper';
import { CCMap } from './phaser/tilemap/cc-map';

@Injectable({
	providedIn: 'root'
})
export class SaveService {
	private snackbar = inject(MatSnackBar);
	private readonly eventsService = inject(GlobalEventsService);
	private readonly mapLoader = inject(MapLoaderService);


	constructor() {
		const eventManager = inject(EventManager);

		eventManager.addEventListener(document as any, 'keydown', (event: KeyboardEvent) => {
			if (Helper.isInputFocused()) {
				return;
			}

			if (event.ctrlKey && event.key.toLowerCase() === 's') {
				event.preventDefault();
				const map = this.mapLoader.tileMap.getValue();
				if (!map) {
					return;
				}
				if (event.shiftKey) {
					this.saveMapAs(map);
				} else {
					this.saveMap(map);
				}
			}
		});
	}

	async saveMap(map: CCMap) {
		const handle = this.mapLoader.handle ?? await this.pickSaveFile(map);
		if (!handle) {
			return;
		}
		await this.writeMap(handle, map);
	}

	async saveMapAs(map: CCMap) {
		const handle = await this.pickSaveFile(map);
		if (!handle) {
			return;
		}
		await this.writeMap(handle, map);
	}

	private async writeMap(handle: FileSystemFileHandle, map: CCMap) {
		try {
			const writable = await handle.createWritable();
			await writable.write(this.generateMapJson(map));
			await writable.close();
			this.eventsService.hasUnsavedChanges.next(false);
			this.snackbar.open('successfully saved map', 'ok', { duration: 3000 });
		} catch (err) {
			console.error(err);
			this.snackbar.open('failed to save map', 'ok', {panelClass: 'snackbar-error'});
		}
	}

	private async pickSaveFile(map: CCMap): Promise<FileSystemFileHandle | undefined> {
		let handle: FileSystemFileHandle;
		try {
			handle = await window.showSaveFilePicker({
				suggestedName: map.filename.endsWith('.json') ? map.filename : `${map.filename}.json`,
				types: MAP_FILE_TYPES,
			});
		} catch (e: unknown) {
			if (!isPickerAbort(e)) {
				console.error(e);
			}
			return undefined;
		}
		this.mapLoader.handle = handle;
		map.filename = handle.name;
		return handle;
	}

	private generateMapJson(map: CCMap) {
		const out = map.exportMap();
		out.filename = undefined;
		return JSON.stringify(out);
	}
}
