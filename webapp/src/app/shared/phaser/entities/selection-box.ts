import {Point} from '../../../models/cross-code-map';
import {Helper} from '../helper';
import {SortableGroup} from '../../../models/sortable';
import {CCEntity} from './cc-entity';

export class SelectionBox {
	
	private active = false;
	private start: Point;
	private game: Phaser.Game;
	private graphics: Phaser.Graphics;
	private selectedEntities: Set<CCEntity>;
	
	constructor(game: Phaser.Game) {
		this.game = game;
		this.selectedEntities = new Set<CCEntity>();
		const group: SortableGroup = game.add.group();
		group.zIndex = 10000;
		
		this.graphics = game.add.graphics(0, 0, group);
	}
	
	public onInputDown(pos: Point) {
		this.active = true;
		this.start = pos;
		this.selectedEntities.clear();
	}
	
	public update(entities: CCEntity[]) {
		if (!this.active) {
			return;
		}
		const pos = Helper.screenToWorld(this.game.input.mousePointer);
		const start = this.start;
		
		let x1 = start.x;
		let y1 = start.y;
		let x2 = pos.x;
		let y2 = pos.y;
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
		
		const rect = new Phaser.Rectangle(x1, y1, x2 - x1, y2 - y1);
		this.graphics.clear();
		this.graphics.beginFill(0x3335ed, 0.3);
		this.graphics.lineStyle(1, 0x3335ed, 0.8);
		this.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
		this.graphics.endFill();
		
		entities.forEach(e => {
			const events = e.collisionImage.events;
			if (rect.intersects(e.getBoundingBox(), 0)) {
				events.onInputOver.dispatch();
				this.selectedEntities.add(e);
			} else {
				events.onInputOut.dispatch();
				this.selectedEntities.delete(e);
			}
		});
	}
	
	public onInputUp(): Set<CCEntity> {
		if (!this.active) {
			return;
		}
		this.graphics.clear();
		this.active = false;
		this.selectedEntities.forEach(e => {
			e.collisionImage.events.onInputOut.dispatch();
		});
		return this.selectedEntities;
	}
}
