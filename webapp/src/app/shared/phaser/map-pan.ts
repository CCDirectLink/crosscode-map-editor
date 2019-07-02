import {Point} from '../../models/cross-code-map';
import {Helper} from './helper';
import {Vec2} from './vec2';
import {Globals} from '../globals';

export class MapPan extends Phaser.GameObjects.GameObject {
	private isScrolling = false;
	private startMouse: Point = {x: 0, y: 0};
	private startCam: Point = {x: 0, y: 0};
	
	private zoomKey: Phaser.Input.Keyboard.Key;
	
	constructor(scene: Phaser.Scene, type: string) {
		super(scene, type);
		
		this.zoomKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT);
		// game.input.mouseWheel.callback = (v) => this.onMouseWheel(v);
		scene.input.on('wheel', (
			pointer: Phaser.Input.Pointer,
			gameObjects: any,
			deltaX: number,
			deltaY: number,
			deltaZ: number
		) => this.onMouseWheel(deltaY));
		scene.input.on('pointerdown', () => this.onMouseDown());
		scene.input.on('pointerup', () => this.onMouseUp());
	}
	
	private onMouseDown() {
		if (!this.active) {
			return;
		}
		this.isScrolling = true;
		console.log('on mouse down');
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
		
		const prevScale = cam.zoom;
		let zoom = delta > 0 ? 0.8 : 1.25;
		zoom *= cam.zoom;
		if (zoom > 0.4 && zoom < 8) {
			cam.zoom = zoom;
			console.log(cam.zoom);
			
			// TODO: adjust position
			// const pointer = this.scene.input.activePointer;
			// const mouseX = pointer.x / prevScale;
			// const mouseY = pointer.y / prevScale;
			// const multiplier = zoom - prevScale;
			//
			// cam.scrollX += mouseX * multiplier;
			// cam.scrollY += mouseY * multiplier;
		}
		Globals.phaserEventsService.updateMapBorder.next(true);
	}
	
	preUpdate() {
		const pointer = this.scene.input.activePointer;
		if (pointer.middleButtonDown() && this.isScrolling && this.active) {
			const dx = pointer.x - this.startMouse.x;
			const dy = pointer.y - this.startMouse.y;
			
			const cam = this.scene.cameras.main;
			cam.scrollX = this.startCam.x - dx / cam.zoom;
			cam.scrollY = this.startCam.y - dy / cam.zoom;
		}
	}
}
