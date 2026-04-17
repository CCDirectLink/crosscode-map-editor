import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Phaser from 'phaser';
import { CCMap } from './phaser/tilemap/cc-map';
import { Globals } from './globals';

@Injectable({
	providedIn: 'root',
})
export class PhaserExportService {
	private snackbar = inject(MatSnackBar);
	
	async exportMapPng(map: CCMap): Promise<void> {
		const game = Globals.game;
		const scene = Globals.scene;
		const camera = scene.cameras.main;
		
		if (!game || !scene) {
			throw new Error('Phaser game is not initialized');
		}
		
		const exportWidth = map.mapWidth * Globals.TILE_SIZE;
		const exportHeight = map.mapHeight * Globals.TILE_SIZE;
		
		const previousState = {
			width: game.scale.width,
			height: game.scale.height,
			zoom: game.scale.zoom,
			scrollX: camera.scrollX,
			scrollY: camera.scrollY,
			zoomX: camera.zoomX,
			zoomY: camera.zoomY,
		};
		
		try {
			game.scale.resize(exportWidth, exportHeight);
			game.scale.setZoom(1);
			camera.setZoom(1, 1);
			camera.setScroll(0, 0);
			
			await this.waitForNextFrame();
			await this.waitForNextFrame();
			
			const image = await this.snapshot(game.renderer);
			const filename = (map.filename || map.name || 'map') + '.png';
			this.downloadImage(image, filename);
			this.snackbar.open('successfully exported PNG', 'ok', { duration: 3000 });
		} catch (error) {
			console.error(error);
			this.snackbar.open('failed to export PNG', 'ok', { panelClass: 'snackbar-error' });
			throw error;
		} finally {
			game.scale.resize(previousState.width, previousState.height);
			game.scale.setZoom(previousState.zoom);
			camera.setZoom(previousState.zoomX, previousState.zoomY);
			camera.setScroll(previousState.scrollX, previousState.scrollY);
		}
	}
	
	private waitForNextFrame(): Promise<void> {
		return new Promise(resolve => requestAnimationFrame(() => resolve()));
	}
	
	private snapshot(renderer: Phaser.Renderer.Canvas.CanvasRenderer | Phaser.Renderer.WebGL.WebGLRenderer): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			renderer.snapshot(image => {
				if (image instanceof HTMLImageElement) {
					resolve(image);
					return;
				}
				reject(new Error('Renderer snapshot did not return an image'));
			}, 'image/png');
		});
	}
	
	private downloadImage(image: HTMLImageElement, filename: string) {
		const a = document.createElement('a');
		a.href = image.src;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => document.body.removeChild(a), 0);
	}
}
