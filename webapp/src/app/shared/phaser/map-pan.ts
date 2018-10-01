
import {Point} from '../interfaces/cross-code-map';
import {Helper} from './helper';

export class MapPan extends Phaser.Plugin {

	private button: Phaser.DeviceButton;
	private isScrolling = false;
	private startMouse: Point = {};
	private startCam: Point = {};
	private zoomKey: Phaser.Key;

	constructor(game: Phaser.Game, parent) {
		super(game, parent);
		this.active = true;
		this.hasUpdate = true;

		this.button = game.input.activePointer.middleButton;
		this.button.onDown.add(() => this.onMouseDown());
		this.button.onUp.add(() => this.onMouseUp());

		this.zoomKey = game.input.keyboard.addKey(Phaser.Keyboard.ALT);

		game.input.mouse.mouseWheelCallback = (v) => this.onMouseWheel(v);
	}

	onMouseDown() {
		this.isScrolling = true;
		this.startMouse.x = this.game.input.x;
		this.startMouse.y = this.game.input.y;

		this.startCam.x = this.game.camera.x;
		this.startCam.y = this.game.camera.y;
	}

	onMouseUp() {
		this.isScrolling = false;
	}

	onMouseWheel(event) {
		if (!this.zoomKey.isDown) {
			return;
		}

		const cam = this.game.camera;

		const prevScale = cam.scale.x;
		let scale = event.deltaY > 0 ? 0.8 : 1.25;
		scale *= cam.scale.x;
		if (scale > 0.4 && scale < 8) {
			cam.scale.setTo(scale);

			// adjust position
			const mouseX = this.game.input.worldX / prevScale;
			const mouseY = this.game.input.worldY / prevScale;
			const multiplier = scale - prevScale;

			cam.x += mouseX * multiplier;
			cam.y += mouseY * multiplier;
		}
		this.game['PhaserEventsService'].cameraZoomUpdate.next(cam.scale);
	}

	update() {
		if (this.isScrolling) {
			// mouse
			const dx = this.game.input.x - this.startMouse.x;
			const dy = this.game.input.y - this.startMouse.y;

			// dx /= this.game.camera.scale.x;
			// dy /= this.game.camera.scale.y;

			this.game.camera.x = this.startCam.x - dx;
			this.game.camera.y = this.startCam.y - dy;
		}
	}


}
