import { Injectable } from '@angular/core';
import { CCMap } from '../renderer/phaser/tilemap/cc-map';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	public disablePhaserInput = false;
	public isElectron: boolean;
	public TILE_SIZE = 16;
	public URL = 'http://localhost:8080/';
	public entitySettings = {
		gridSize: 8,
		enableGrid: false
	};

	//TODO remove
	public scene!: Phaser.Scene;
	public map!: CCMap;

	public constructor() {
		this.isElectron = this.checkElectron();
	}

	private checkElectron(): boolean {
		return typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron;
	}
}
