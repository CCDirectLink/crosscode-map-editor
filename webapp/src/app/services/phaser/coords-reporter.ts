import { combineLatest, Subscription } from 'rxjs';
import { Point } from '../../models/cross-code-map';
import { EditorView } from '../../models/editor-view';
import { Globals } from '../globals';
import { BaseObject } from './base-object';

export class CoordsReporter extends BaseObject {
	private rawCoords: Point = {x: 0, y: 0};
	
	private sub!: Subscription;
	
	constructor(scene: Phaser.Scene, active = true) {
		super(scene, 'coordsReporter', active);
	}
	
	protected init() {
		combineLatest([
			Globals.globalEventsService.currentView,
			Globals.globalEventsService.is3D
		]).subscribe(([view, is3d]) => {
			this.setActive(view === EditorView.Entities && !is3d);
		});
	}
	
	protected activate() {}
	
	protected deactivate() {
		Globals.globalEventsService.updateCoords.next();
	}
	
	destroy(fromScene?: boolean) {
		this.sub.unsubscribe();
		super.destroy(fromScene);
	}
	
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
	
	preUpdate() {
		const pointer = this.scene.input.activePointer;
		
		const newRaw = {
			x: Math.floor(pointer.worldX),
			y: Math.floor(pointer.worldY),
		};
		
		this.rawCoords = newRaw;
		
		// send event
		Globals.globalEventsService.updateCoords.next({
			...this.coords,
			z: this.entityLevel,
		});
	}
}
