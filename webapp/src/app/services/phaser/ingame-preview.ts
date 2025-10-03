import { PreUpdate } from './pre-update';
import { Globals } from '../globals';
import { Subscription } from 'rxjs';

export class IngamePreview
	extends Phaser.GameObjects.Image
	implements PreUpdate
{
	private sub: Subscription;

	constructor(scene: Phaser.Scene) {
		super(scene, 0, 0, 'ingame');
		this.depth = 99999;
		this.sub = Globals.globalEventsService.showIngamePreview.subscribe(
			(v) => (this.visible = v),
		);
	}

	override destroy(fromScene?: boolean) {
		super.destroy(fromScene);
		this.sub.unsubscribe();
	}

	preUpdate(time: number, delta: number): void {
		const cam = this.scene.cameras.main;

		const midX = cam.scrollX + cam.width * 0.5;
		const midY = cam.scrollY + cam.height * 0.5;

		const displayWidth = cam.width / cam.zoomX;
		const displayHeight = cam.height / cam.zoomY;

		const centerX = midX - displayWidth * 0.1;
		const centerY = midY - displayHeight * 0.06;

		this.x = centerX;
		this.y = centerY;
	}
}
