interface Point {
	x?: number;
	y?: number;
}

export class MapPan extends Phaser.Plugin {

	private button: Phaser.DeviceButton;
	private isScrolling = false;
	private startMouse: Point = {};
	private startCam: Point = {};
	private upKey: Phaser.Key;
	private downKey: Phaser.Key;
	private leftKey: Phaser.Key;
	private rightKey: Phaser.Key;
	private turboKey: Phaser.Key;
	private zoomKey: Phaser.Key;

	constructor(game: Phaser.Game, parent) {
		super(game, parent);
		this.active = true;
		this.hasUpdate = true;

		this.button = game.input.activePointer.middleButton;
		this.button.onDown.add(() => this.onMouseDown());
		this.button.onUp.add(() => this.onMouseUp());

		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.turboKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

		game.input.keyboard.removeKeyCapture(this.upKey.keyCode);
		game.input.keyboard.removeKeyCapture(this.downKey.keyCode);
		game.input.keyboard.removeKeyCapture(this.leftKey.keyCode);
		game.input.keyboard.removeKeyCapture(this.rightKey.keyCode);
		game.input.keyboard.removeKeyCapture(this.turboKey.keyCode);

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
		if (scale > 0.5 && scale < 6) {
			cam.scale.setTo(scale);

			// adjust position
			const mouseX = this.game.input.worldX / prevScale;
			const mouseY = this.game.input.worldY / prevScale;
			const multiplier = scale - prevScale;

			cam.x += mouseX * multiplier;
			cam.y += mouseY * multiplier;
		}
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
		} else {
			// keyboard
			let dx = 0;
			let dy = 0;

			if (this.downKey.isDown) {
				dy += 1;
			}
			if (this.upKey.isDown) {
				dy -= 1;
			}
			if (this.rightKey.isDown) {
				dx += 1;
			}
			if (this.leftKey.isDown) {
				dx -= 1;
			}

			let scale = 5;
			if (this.turboKey.isDown) {
				scale = 15;
			}
			this.game.camera.x += dx * scale;
			this.game.camera.y += dy * scale;
		}
	}


}
