import { Point } from '../../models/cross-code-map';
import { Globals } from '../globals';

export class CoordsHUD extends Phaser.GameObjects.GameObject {
	private exact: Point = { x: 0, y: 0 };

	private get offsetExact(): Point {
		return {
			x: this.exact.x,
			y: this.exact.y + this.levelOffset,
		};
	}

	private get tile(): Point {
		return {
			x: Math.floor(this.exact.x / Globals.TILE_SIZE),
			y: Math.floor(this.exact.y / Globals.TILE_SIZE),
		};
	}

	private text: Phaser.GameObjects.Text;

	constructor(scene: Phaser.Scene, type: string) {
		super(scene, type);

		// the text pos is inited as 0, it'll be properly set in updateText()
		this.text = scene.add
			.text(0, 0, '')
			.setFontFamily('Roboto, "Helvetica Neue", sans-serif')
			.setBackgroundColor('#0006')
			.setPadding(5, 5, 5, 5)
			.setDepth(1000);
	}

	private updateText() {
		const t = this.tile;
		const e = this.exact;
		const oe = this.offsetExact;

		const cam = this.scene.cameras.main;

		// zoom compensation
		const xZoomComp = (cam.width - cam.displayWidth) / 2;
		const yZoomComp = (cam.height - cam.displayHeight) / 2;

		this.text
			.setText(
				`Tile: (${t.x}, ${t.y}) Absolute: (${e.x}, ${e.y}) Layer: (${oe.x}, ${oe.y})`
			)
			.setScale(1 / cam.zoom)
			// if the camera is 5 units right, move the text 5 units right ETC
			.setX(cam.scrollX + xZoomComp)
			.setY(
				cam.scrollY + // as above
					cam.displayHeight - // move to the bottom of the screen
					this.text.displayHeight + // make sure its visible, not just out of view
					yZoomComp
			);
	}

	private get levelOffset(): number {
		const maybeLevel =
			Globals.mapLoaderService.selectedLayer.value?.details.level;

		return typeof maybeLevel === 'number'
			? Globals.map.levels[maybeLevel].height
			: 0;
	}

	preUpdate() {
		const pointer = this.scene.input.activePointer;
		this.exact = {
			x: Math.floor(pointer.worldX),
			y: Math.floor(pointer.worldY),
		};

		this.updateText();
	}
}
