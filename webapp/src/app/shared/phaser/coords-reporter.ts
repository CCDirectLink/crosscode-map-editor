import { Point } from '../../models/cross-code-map';
import { EditorView } from '../../models/editor-view';
import { Globals } from '../globals';

export class CoordsReporter extends Phaser.GameObjects.GameObject {
	private rawCoords: Point = { x: 0, y: 0 };

	private get coords(): Point {
		return {
			x: this.rawCoords.x,
			y: this.rawCoords.y + this.entityLevel,
		};
	}

	private get isEntityMode() {
		return Globals.globalEventsService.currentView.value === EditorView.Entities;
	}

	private get entityLevel() {
		const maybeLevel =
			Globals.globalEventsService.selectedEntity.value?.details.level;

		return maybeLevel
			? Globals.map.levels[maybeLevel.level].height + maybeLevel.offset
			: 0;
	}

	// used to help hide coords without firing duplicate events
	private lastModeWasTile = true;

	private preUpdate() {
		const tileMode = !this.isEntityMode;
		if (tileMode) {
			if (!this.lastModeWasTile) {
				Globals.globalEventsService.updateCoords.next(undefined);
			}

			return;
		}

		const pointer = this.scene.input.activePointer;

		const newRaw = {
			x: Math.floor(pointer.worldX),
			y: Math.floor(pointer.worldY),
		};

		// don't send events if we don't have to
		/* if (newRaw.x === this.rawCoords.x && newRaw.y === this.rawCoords.y) {
			return;
		} */

		this.rawCoords = newRaw;
		this.lastModeWasTile = tileMode;

		// send event
		Globals.globalEventsService.updateCoords.next({
			...this.coords,
			z: this.entityLevel,
		});
	}
}
