import { BaseObject } from './base-object';
import { Globals } from '../globals';
import { CCMap } from './tilemap/cc-map';
import { IngamePreview } from './ingame-preview';

export class LayerParallax extends BaseObject {
	private map?: CCMap;

	constructor(
		scene: Phaser.Scene,
		private preview: IngamePreview,
	) {
		super(scene, LayerParallax.name, true);
	}

	protected activate(): void {
		this.addSubscription(
			Globals.mapLoaderService.tileMap.subscribe(
				(map) => (this.map = map),
			),
		);
	}

	protected deactivate(): void {
		if (!this.map) {
			return;
		}
		for (const layer of this.map.layers) {
			layer.setOffset(0, 0);
		}
	}

	protected init(): void {}

	preUpdate(time: number, delta: number) {
		if (!this.map) {
			return;
		}

		const layers = this.map.layers;

		const centerX = this.preview.x;
		const centerY = this.preview.y;

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
