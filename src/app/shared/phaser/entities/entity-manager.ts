import {CCEntity, InputEvents} from './cc-entity';
import {Sortable} from '../../interfaces/sortable';
import {Helper} from '../helper';
import {CCMap} from '../tilemap/cc-map';
import {CrossCodeMap, MapEntity} from '../../interfaces/cross-code-map';
import {Vec2} from '../vec2';
import {GlobalEventsService} from '../../global-events.service';
import {EntityDefinition} from '../../interfaces/entity-definition';

export class EntityManager extends Phaser.Plugin implements Sortable {

	public zIndex: number;
	private keyBindings: Phaser.SignalBinding[] = [];
	private map: CCMap;
	private entities: CCEntity[];

	private multiSelectKey: Phaser.Key;
	private copyKey: Phaser.Key;
	private pasteKey: Phaser.Key;
	private deleteKey: Phaser.Key;
	private cancelSelectionKey: Phaser.DeviceButton;
	private inputEvents: InputEvents = {};
	private selectedEntities: CCEntity[];
	private copyEntities: CCEntity[];
	private globalEvents: GlobalEventsService;

	constructor(game: Phaser.Game, parent) {
		super(game, parent);
		this.active = true;
		this.hasUpdate = true;
		this.zIndex = 900;
		this.selectedEntities = [];
		this.multiSelectKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
		this.copyKey = game.input.keyboard.addKey(Phaser.Keyboard.C);
		this.pasteKey = game.input.keyboard.addKey(Phaser.Keyboard.V);
		this.deleteKey = game.input.keyboard.addKey(Phaser.Keyboard.DELETE);
		this.cancelSelectionKey = game.input.mousePointer.rightButton;

		this.inputEvents.onLeftClick = (e, pointer) => {
			this.selectEntity(e, this.multiSelectKey.isDown);
		};

		this.inputEvents.onInputDown = (e, pointer) => {
			if (pointer.leftButton.isDown) {
				// to allow instant drag of a single entity
				if (this.selectedEntities.indexOf(e) < 0) {
					if (!this.multiSelectKey.isDown) {
						this.selectEntity(e);
					}
				}
				this.selectedEntities.forEach(entity => {
					entity.startOffset = Vec2.sub(Helper.screenToWorld(this.game, pointer), entity.group, true);
					entity.isDragged = true;
				});
			}
		};
		this.inputEvents.onInputUp = (e, pointer, isOver) => {
			this.selectedEntities.forEach(entity => {
				entity.isDragged = false;
			});
		};
	}

	/** generates all entities and adds proper input handling */
	initialize(ccMap: CCMap, mapInput: CrossCodeMap) {
		this.map = ccMap;
		if (this.entities) {
			this.entities.forEach(e => e.destroy());
		}
		this.entities = [];

		if (mapInput.entities) {
			mapInput.entities.forEach((entity, i) => {
				// if (entity.type === 'Prop' || entity.type === 'ScalableProp') {
				// 	return;
				// }
				// if (i > 0) {
				// 	return;
				// }
				this.generateEntity(entity);
			});
		}
	}

	selectEntity(entity: CCEntity, multiple = false) {
		if (multiple) {
			const i = this.selectedEntities.indexOf(entity);
			if (i >= 0) {
				entity.setSelected(false);
				this.selectedEntities.splice(i, 1);
			} else {
				entity.setSelected(true);
				this.selectedEntities.push(entity);
			}
		} else if (this.selectedEntities[0] !== entity || this.selectedEntities.length !== 1) {
			this.globalEvents.selectedEntity.next(entity);
		}
	}

	generateEntity(entity: MapEntity): CCEntity {
		const definitions = this.game.cache.getJSON('definitions.json', false);
		const def: EntityDefinition = definitions[entity.type];
		def.type = entity.type;
		const ccEntity = new CCEntity(this.game, this.map, entity.x, entity.y, def, this.inputEvents);
		ccEntity.settings = entity.settings;
		ccEntity.level = entity.level;
		this.entities.push(ccEntity);
		return ccEntity;
	}

	setGlobalEvents(globalEvents: GlobalEventsService) {
		this.globalEvents = globalEvents;
		this.globalEvents.selectedEntity.subscribe(entity => {
			this.selectedEntities.forEach(e => e.setSelected(false));
			this.selectedEntities = [];
			if (entity) {
				entity.setSelected(true);
				this.selectedEntities.push(entity);
			}
		});
	}

	copy() {
		this.copyEntities = this.selectedEntities.slice();
	}

	paste() {
		if (this.copyEntities.length === 0) {
			return;
		}
		const offset = Vec2.create(this.copyEntities[0].group);
		offset.y -= this.map.levels[this.copyEntities[0].details.level.level].height;
		const mousePos = Vec2.create(Helper.screenToWorld(this.game, this.game.input.mousePointer));
		this.selectEntity(null);

		this.copyEntities.forEach(e => {
			const entityDef = e.exportEntity();
			Vec2.sub(entityDef, offset);
			Vec2.add(entityDef, mousePos);
			const newEntity = this.generateEntity(entityDef);
			newEntity.setEnableInput(true);
			this.selectEntity(newEntity, this.copyEntities.length > 1);
		});

		console.log(this.entities);
	}

	delete() {
		this.selectedEntities.forEach(e => {
			const i = this.entities.indexOf(e);
			this.entities.splice(i, 1);
			e.destroy();
		});
		this.selectEntity(null);
	}

	deactivate() {
		this.keyBindings.forEach(binding => binding.detach());
		this.keyBindings = [];
		if (!this.map) {
			return;
		}
		this.selectEntity(null);
		this.entities.forEach(entity => {
			entity.setEnableInput(false);
			entity.setSelected(false);
		});
	}

	activate() {
		// this.keyBindings.push(this.game.input.mousePointer.rightButton.onDown.add(() => this.openContextMenu()));
		// this.keyBindings.push(this.game.input.mousePointer.leftButton.onDown.add(() => this.selectEntity(null)));
		this.keyBindings.push(this.cancelSelectionKey.onDown.add(() => this.selectEntity(null)));
		this.keyBindings.push(this.deleteKey.onDown.add(() => this.delete()));
		this.keyBindings.push(this.copyKey.onDown.add(() => {
			if (!this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
				return;
			}
			this.copy();
		}));
		this.keyBindings.push(this.pasteKey.onDown.add(() => {
			if (!this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
				return;
			}
			this.paste();
		}));
		if (!this.map) {
			return;
		}
		this.entities.forEach(entity => {
			entity.setEnableInput(true);
		});
	}

	exportEntities(): MapEntity[] {
		const out = [];
		this.entities.forEach(e => out.push(e.exportEntity()));
		return out;
	}
}
