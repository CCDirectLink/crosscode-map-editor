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
			.setPadding(5, 0, 0, 5)
			.setDepth(1000);
	}

	private updateText() {
		const t = this.tile;
		const e = this.exact;
		const oe = this.offsetExact;

		this.text
			.setText(`Tile: (${t.x}, ${t.y}) Absolute: (${e.x}, ${e.y}) Layer: (${oe.x}, ${oe.y})`)
			// if the camera is 5 units right, move the text 5 units right ETC
			.setX(this.scene.cameras.main.scrollX)
			.setY(
				this.scene.cameras.main.scrollY + // as above
					this.scene.cameras.main.height - // move to the bottom of the screen
					this.text.height // make sure its visible, not just out of view
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
