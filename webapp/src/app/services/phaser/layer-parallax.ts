import { BaseObject } from './base-object';
import { Globals } from '../globals';
import { CCMap } from './tilemap/cc-map';

export class LayerParallax extends BaseObject {
	
	private map?: CCMap;
	private centerObject?: Phaser.GameObjects.Image;
	
	constructor(scene: Phaser.Scene) {
		super(scene, LayerParallax.name, true);
	}
	
	protected activate(): void {
		this.addSubscription(Globals.mapLoaderService.tileMap.subscribe(map => this.map = map));
		
		// TODO: move image into new class, maybe toggleable with a secret hotkey?
		this.centerObject = this.scene.add.image(0, 0, 'ingame');
		this.centerObject.depth = 99999999;
		this.centerObject.visible = false;
	}
	
	protected deactivate(): void {
		if (!this.map) {
			return;
		}
		for (const layer of this.map.layers) {
			layer.setOffset(0, 0);
		}
		this.centerObject?.destroy(true);
	}
	
	protected init(): void {
	}
	
	override preUpdate(time: number, delta: number) {
		if (!this.map) {
			return;
		}
		const layers = this.map.layers;
		const cam = this.scene.cameras.main;
		
		const midX = cam.scrollX + cam.width * 0.5;
		const midY = cam.scrollY + cam.height * 0.5;
		
		const displayWidth = cam.width / cam.zoomX;
		const displayHeight = cam.height / cam.zoomY;
		
		const centerX = midX - displayWidth * 0.15;
		const centerY = midY - displayHeight * 0.05;
		
		if (this.centerObject?.visible) {
			this.centerObject.x = centerX;
			this.centerObject.y = centerY;
		}
		
		// half of game resolution
		const offX = centerX - 284;
		const offY = centerY - 160;
		
		for (const layer of layers) {
			if (!layer.visible) {
				continue;
			}
			let x = offX / (layer.details?.distance ?? 1);
			let y = offY / (layer.details?.distance ?? 1);
			
			if (layer.details.distance < 1) {
				x += 16;
				y += 16;
			}
			
			layer.setOffset(offX - x, offY - y);
		}
	}
	
}
