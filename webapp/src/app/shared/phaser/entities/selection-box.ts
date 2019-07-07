import {Point} from '../../../models/cross-code-map';
import {Helper} from '../helper';
import {CCEntity} from './cc-entity';

export class SelectionBox {
	
	private active = false;
	private start: Point = {x: 0, y: 0};
	private scene: Phaser.Scene;
	private graphics: Phaser.GameObjects.Graphics;
	private selectedEntities: Set<CCEntity>;
	
	constructor(scene: Phaser.Scene) {
		this.scene = scene;
		this.selectedEntities = new Set<CCEntity>();
		this.graphics = scene.add.graphics({
			fillStyle: {
				color: 0x3335ed,
				alpha: 0.3
			},
			lineStyle: {
				width: 1,
				color: 0x3335ed,
				alpha: 0.8
			}
		});
		this.graphics.depth = 1000;
	}
	
	public onInputDown(pointer: Phaser.Input.Pointer) {
		this.active = true;
		this.start.x = pointer.worldX;
		this.start.y = pointer.worldY;
		this.selectedEntities.clear();
	}
	
	public update(entities: CCEntity[]) {
		if (!this.active) {
			return;
		}
		const posX = this.scene.input.activePointer.worldX;
		const posY = this.scene.input.activePointer.worldY;
		const start = this.start;
		
		let x1 = start.x;
		let y1 = start.y;
		let x2 = posX;
		let y2 = posY;
		if (x2 < x1) {
			const tmp = x1;
			x1 = x2;
			x2 = tmp;
		}
		if (y2 < y1) {
			const tmp = y1;
			y1 = y2;
			y2 = tmp;
		}
		
		const rect = new Phaser.Geom.Rectangle(x1, y1, x2 - x1, y2 - y1);
		this.graphics.clear();
		this.graphics.fillRect(rect.x, rect.y, rect.width, rect.height);
		this.graphics.strokeRect(rect.x, rect.y, rect.width, rect.height);
		
		entities.forEach(e => {
			// TODO
			if (Phaser.Geom.Intersects.RectangleToRectangle(rect, e.getBoundingBox())) {
				e.inputOver();
				this.selectedEntities.add(e);
			} else {
				e.inputOut();
				this.selectedEntities.delete(e);
			}
		});
	}
	
	public onInputUp(): Set<CCEntity> {
		if (!this.active) {
			return new Set<CCEntity>();
		}
		this.graphics.clear();
		this.active = false;
		this.selectedEntities.forEach(e => {
			// TODO
			// e.collisionImage.events.onInputOut.dispatch();
		});
		return this.selectedEntities;
	}
}
