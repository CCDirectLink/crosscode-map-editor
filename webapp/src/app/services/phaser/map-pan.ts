import { Point } from '../../models/cross-code-map';
import { Globals } from '../../services/globals';
import { Vec2 } from './vec2';

export class MapPan extends Phaser.GameObjects.GameObject {
	private isScrolling = false;
	private startMouse: Point = {x: 0, y: 0};
	private startCam: Point = {x: 0, y: 0};
	
	private zoomKey: Phaser.Input.Keyboard.Key;
	private panKey: Phaser.Input.Keyboard.Key;
	
	constructor(scene: Phaser.Scene, type: string) {
		super(scene, type);
		
		this.zoomKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT, false);
		this.panKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL, false);
		// game.input.mouseWheel.callback = (v) => this.onMouseWheel(v);
		scene.input.on('wheel', (
			pointer: Phaser.Input.Pointer,
			gameObjects: any,
			deltaX: number,
			deltaY: number,
			//deltaZ: number
		) => this.onMouseWheel(deltaY));
		scene.input.on('pointerdown', () => this.onMouseDown());
		scene.input.on('pointerup', () => this.onMouseUp());
	}
	
	private onMouseDown() {
		if (!this.active) {
			return;
		}

		// set global panning state when the panKey is down
		if (this.panKey.isDown || this.scene.input.activePointer.middleButtonDown()) {
			Globals.panning = true;
		} else {
			Globals.panning = false;
			return;
		}

		this.isScrolling = true;
		const cam = this.scene.cameras.main;
		Vec2.assign(this.startMouse, this.scene.input.activePointer);
		
		this.startCam.x = cam.scrollX;
		this.startCam.y = cam.scrollY;
	}
	
	private onMouseUp() {
		this.isScrolling = false;
	}
	
	private onMouseWheel(delta: number) {
		if (!this.zoomKey.isDown) {
			return;
		}
		
		const cam = this.scene.cameras.main;
		
		let zoom = delta > 0 ? 0.8 : 1.25;
		zoom *= cam.zoom;
		if (zoom > 0.4 && zoom < 50) {
			
			const pointer = this.scene.input.activePointer;
			
			const mouse = Vec2.createC(pointer.worldX, pointer.worldY);
			const oldX = mouse.x;
			const oldY = mouse.y;
			cam.zoom = zoom;
			
			// @ts-ignore
			cam.preRender(this.scene.scale.resolution);
			cam.getWorldPoint(pointer.x, pointer.y, <any>mouse);
			cam.scrollX += oldX - mouse.x;
			cam.scrollY += oldY - mouse.y;
		}
		Globals.phaserEventsService.updateMapBorder.next(true);
	}
	
	preUpdate() {

		const pointer = this.scene.input.activePointer;
		
		Globals.panning = this.panKey.isDown || pointer.middleButtonDown();

		if (Globals.panning && this.isScrolling && this.active && pointer.isDown) {
			const dx = pointer.x - this.startMouse.x;
			const dy = pointer.y - this.startMouse.y;
			
			const cam = this.scene.cameras.main;
			cam.scrollX = this.startCam.x - dx / cam.zoom;
			cam.scrollY = this.startCam.y - dy / cam.zoom;
		}
	}
}
