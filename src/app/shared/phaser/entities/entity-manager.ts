import {CCEntity, InputEvents} from './cc-entity';
import {Sortable} from '../../interfaces/sortable';
import {Helper} from '../helper';
import {CCMap} from '../tilemap/cc-map';
import {CrossCodeMap, Point} from '../../interfaces/cross-code-map';
import {Vec2} from '../vec2';

export class EntityManager extends Phaser.Plugin implements Sortable {

	public zIndex: number;
	private keyBindings: Phaser.SignalBinding[] = [];
	private map: CCMap;

	private inputEvents: InputEvents = {};
	private selectedEntity: CCEntity;

	constructor(game: Phaser.Game, parent) {
		super(game, parent);
		this.active = true;
		this.hasUpdate = true;
		this.zIndex = 900;

		const ref = this;

		this.inputEvents.onInputDown = (e, pointer) => {
			console.log(e);
			console.log(pointer);
			if (pointer.leftButton.isDown) {
				this.selectEntity(e);
				e.startOffset = Vec2.sub(Helper.screenToWorld(this.game, pointer), e.group, true);
				e.isDragged = true;
			}
		};
	}

	private openContextMenu() {
	}

	update() {

	}

	/** generates all entities and adds proper input handling */
	initialize(ccMap: CCMap, mapInput: CrossCodeMap) {
		this.map = ccMap;

		if (mapInput.entities) {
			mapInput.entities.forEach(entity => {
				// if (entity.x < 10 || entity.x > 50 || entity.y > 300 || entity.y < 150) {
				// 	return;
				// }
				const ccEntity = new CCEntity(this.game, ccMap, entity.x, entity.y, this.inputEvents);
				ccEntity.settings = entity.settings;
				ccEntity.ccType = entity.type;
				ccEntity.level = entity.level;
				ccMap.entities.push(ccEntity);
			});
		}
	}

	selectEntity(entity: CCEntity) {
		if (this.selectedEntity) {
			this.selectedEntity.setSelected(false);
		}
		this.selectedEntity = entity;
		if (entity) {
			entity.setSelected(true);
		}
	}

	deactivate() {
		this.keyBindings.forEach(binding => binding.detach());
		this.keyBindings = [];
		if (!this.map) {
			return;
		}
		this.map.entities.forEach(entity => {
			entity.setEnableInput(false);
		});
	}

	activate() {
		// this.keyBindings.push(this.game.input.mousePointer.rightButton.onDown.add(() => this.openContextMenu()));
		this.keyBindings.push(this.game.input.mousePointer.leftButton.onDown.add(() => this.selectEntity(null)));
		if (!this.map) {
			return;
		}
		this.map.entities.forEach(entity => {
			entity.setEnableInput(true);
		});
	}
}
