import { Scene } from 'phaser';
import { Globals } from '../globals';
import { debounceTime, merge, Subscription } from 'rxjs';
import { Point } from '../../models/cross-code-map';

export class EntityGrid extends Phaser.GameObjects.GameObject {
	private sub: Subscription;
	private grid?: Phaser.GameObjects.Grid;
	
	constructor(scene: Scene) {
		super(scene, 'EntityGrid');
		
		this.sub = merge(
			Globals.globalEventsService.gridSettings,
			Globals.mapLoaderService.map,
			Globals.globalEventsService.resizeMap
		).pipe(debounceTime(1)).subscribe(() => this.updateGrid());
	}
	
	updateGrid() {
		const settings = Globals.gridSettings();
		const scale = 4;
		this.grid?.destroy();
		if (!settings.enableGrid || !settings.visible) {
			return;
		}
		const pos: Point = {
			x: settings.offset.x % settings.size.x,
			y: settings.offset.y % settings.size.y
		};
		
		if (pos.x > 0) {
			pos.x -= settings.size.x;
		}
		if (pos.y > 0) {
			pos.y -= settings.size.y;
		}
		
		const width = Globals.map.mapWidth * Globals.TILE_SIZE - pos.x;
		const height = Globals.map.mapHeight * Globals.TILE_SIZE - pos.y;
		
		let color = parseInt(settings.color.substring(1), 16);
		if (isNaN(color)) {
			color = 0x222222;
		}
		
		this.grid = new Phaser.GameObjects.Grid(
			this.scene,
			pos.x,
			pos.y,
			width * scale,
			height * scale,
			settings.size.x * scale,
			settings.size.y * scale,
			undefined,
			0,
			color,
			0.6
		);
		this.grid.depth = 500;
		this.grid.setOrigin(0, 0);
		this.grid.setScale(1 / scale, 1 / scale);
		
		this.scene.add.existing(this.grid);
	}
	
	override destroy(fromScene?: boolean) {
		super.destroy(fromScene);
		this.grid?.destroy();
		this.sub.unsubscribe();
	}
}
