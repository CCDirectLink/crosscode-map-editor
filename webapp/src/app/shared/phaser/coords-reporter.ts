import { Point } from '../../models/cross-code-map';
import { EditorView } from '../../models/editor-view';
import { Globals } from '../globals';

export interface CoordsData {
	exact: Point;
	tile: Point;
	layer: Point | null;
}

export class CoordsReporter extends Phaser.GameObjects.GameObject {
	private exact: Point = { x: 0, y: 0 };

	private get tile(): Point {
		return {
			x: Math.floor(this.exact.x / Globals.TILE_SIZE),
			y: Math.floor(this.exact.y / Globals.TILE_SIZE),
		};
	}

	private get layerExact(): Point | null {
		const offset = this.levelOffset;
		return offset === null
			? null
			:	{
				x: this.exact.x,
				y: this.exact.y + offset
			};
	}

	private get isTileMode() {
		return (
			Globals.globalEventsService.currentView.value === EditorView.Layers
		);
	}

	private get tileLevel() {
		const maybeLevel =
			Globals.mapLoaderService.selectedLayer.value?.details.level;

		// for some reason, we need to compensate backwards.
		return typeof maybeLevel === 'number' ? maybeLevel : null;
	}

	private get entityLevel() {
		return Globals.globalEventsService.selectedEntity.value?.details.level;
	}

	private get levelOffset(): number | null {
		let level: number | null = null;
		let offset = 0;

		if (this.isTileMode) {
			const maybeLevel = this.tileLevel;

			if (maybeLevel !== null) {
				level = maybeLevel;
			}
		} else {
			const maybeLevel = this.entityLevel;

			if (maybeLevel) {
				level = maybeLevel.level;
				offset = maybeLevel.offset;
			}
		}

		const levels = Globals.map.levels;

		if (level !== null && levels[level] === undefined) {
			console.log(levels, this.tileLevel);
		}

		return level !== null && levels[level] !== undefined
			? levels[level].height + offset
			: null;
	}

	private sendEvent() {
		Globals.globalEventsService.updateCoords.next({
			exact: this.exact,
			tile: this.tile,
			layer: this.layerExact,
		});
	}

	preUpdate() {
		const pointer = this.scene.input.activePointer;

		const newExact = {
			x: Math.floor(pointer.worldX),
			y: Math.floor(pointer.worldY),
		};

		// don't send events if we don't have to
		if (newExact.x === this.exact.x && newExact.y === this.exact.y) {
			return;
		}

		this.exact = newExact;

		this.sendEvent();
	}
}
