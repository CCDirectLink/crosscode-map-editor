import {CCEntity, InputEvents} from './cc-entity';
import {Sortable} from '../../../models/sortable';
import {Helper} from '../helper';
import {CCMap} from '../tilemap/cc-map';
import {CrossCodeMap, MapEntity} from '../../../models/cross-code-map';
import {Vec2} from '../vec2';
import {GlobalEventsService} from '../../global-events.service';
import {Globals} from '../../globals';
import {SelectionBox} from './selection-box';
import {EntityRegistryService} from './entity-registry.service';

enum MouseButtons {
	Left,
	Right,
	Middle
}

export class EntityManager extends Phaser.Plugin implements Sortable {
	
	public zIndex: number;
	private keyBindings: Phaser.SignalBinding[] = [];
	private map: CCMap;
	private entities: CCEntity[];
	
	private multiSelectKey: Phaser.Key;
	private copyKey: Phaser.Key;
	private pasteKey: Phaser.Key;
	private deleteKey: Phaser.Key;
	private gridKey: Phaser.Key;
	private visibilityKey: Phaser.Key;
	
	private inputEvents: InputEvents = {};
	private selectedEntities: CCEntity[];
	private copyEntities: CCEntity[];
	private globalEvents: GlobalEventsService;
	
	private selectionBox: SelectionBox;
	
	// image to receive input behind the sprites
	private inputImg: Phaser.Image;
	
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
		this.gridKey = game.input.keyboard.addKey(Phaser.Keyboard.G);
		this.visibilityKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
		
		game.input.keyboard.removeKeyCapture(this.copyKey.keyCode);
		game.input.keyboard.removeKeyCapture(this.pasteKey.keyCode);
		game.input.keyboard.removeKeyCapture(this.deleteKey.keyCode);
		game.input.keyboard.removeKeyCapture(this.gridKey.keyCode);
		game.input.keyboard.removeKeyCapture(this.visibilityKey.keyCode);
		
		this.selectionBox = new SelectionBox(this.game);
		
		this.inputImg = game.add.image(-9999, -9999);
		this.inputImg.width = 999999;
		this.inputImg.height = 999999;
		let buttonPressed: MouseButtons;
		this.inputImg.events.onInputDown.add((e, pointer) => {
			if (pointer.middleButton.isDown) {
				buttonPressed = MouseButtons.Middle;
			} else if (pointer.leftButton.isDown) {
				buttonPressed = MouseButtons.Left;
				this.selectionBox.onInputDown(Helper.screenToWorld(pointer));
			} else if (pointer.rightButton.isDown) {
				buttonPressed = MouseButtons.Right;
			}
		});
		this.inputImg.events.onInputUp.add((e, pointer) => {
			if (buttonPressed === MouseButtons.Middle) {
				return;
			}
			if (buttonPressed === MouseButtons.Right) {
				this.selectEntity(null);
				this.showAddEntityMenu();
			}
			
			if (buttonPressed === MouseButtons.Left) {
				const entities = this.selectionBox.onInputUp();
				if (!this.multiSelectKey.isDown) {
					this.selectEntity(null, false);
				}
				entities.forEach(entity => {
					this.selectEntity(entity, true);
				});
			}
		});
		
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
					entity.startOffset = Vec2.sub(Helper.screenToWorld(pointer), entity.group, true);
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
	
	update() {
		this.selectionBox.update(this.entities);
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
		const registry: EntityRegistryService = this.game['EntityRegistryService'];
		
		const entityClass = registry.getEntity(entity.type);
		
		const ccEntity = new entityClass(this.game, this.map, entity.x, entity.y, this.inputEvents, entity.type);
		ccEntity.setSettings(entity.settings);
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
		this.globalEvents.generateNewEntity.subscribe(entity => {
			
			// TODO: better generate level from collision tiles
			entity.level = this.map.masterLevel;
			const e = this.generateEntity(entity);
			
			// level offset
			const offset = this.map.levels[e.details.level.level];
			e.group.y += offset.height;
			
			// entity manager is activated
			if (this.inputImg.inputEnabled) {
				e.setEnableInput(true);
				this.selectEntity(e);
			}
		});
	}
	
	copy() {
		console.log(Helper.isInputFocused());
		this.copyEntities = this.selectedEntities.slice();
	}
	
	paste() {
		if (this.copyEntities.length === 0) {
			return;
		}
		const offset = Vec2.create(this.copyEntities[0].group);
		offset.y -= this.map.levels[this.copyEntities[0].details.level.level].height;
		const mousePos = Vec2.create(Helper.screenToWorld(this.game.input.mousePointer));
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
	
	deleteSelectedEntities() {
		this.selectedEntities.forEach(e => {
			const i = this.entities.indexOf(e);
			this.entities.splice(i, 1);
			e.destroy();
		});
		this.selectEntity(null);
	}
	
	deactivate() {
		this.inputImg.inputEnabled = false;
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
		this.inputImg.inputEnabled = true;
		this.inputImg.input.priorityID = 1;
		
		this.keyBindings.push(this.gridKey.onDown.add(() => {
			console.log('grid key down');
			console.log(Helper.isInputFocused());
			if (Helper.isInputFocused()) {
				return;
			}
			Globals.entitySettings.enableGrid = !Globals.entitySettings.enableGrid;
		}));
		this.keyBindings.push(this.deleteKey.onDown.add(() => {
			if (Helper.isInputFocused()) {
				return;
			}
			this.deleteSelectedEntities();
		}));
		this.keyBindings.push(this.copyKey.onDown.add(() => {
			if (!this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
				return;
			}
			if (Helper.isInputFocused()) {
				return;
			}
			this.copy();
		}));
		this.keyBindings.push(this.pasteKey.onDown.add(() => {
			if (!this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
				return;
			}
			if (Helper.isInputFocused()) {
				return;
			}
			this.paste();
		}));
		this.keyBindings.push(this.visibilityKey.onDown.add(() => {
			if (Helper.isInputFocused()) {
				return;
			}
			this.entities.forEach(e => {
				e.group.visible = !e.group.visible;
			});
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
	
	private showAddEntityMenu() {
		this.globalEvents.showAddEntityMenu.next({
			worldPos: Helper.screenToWorld(this.game.input.mousePointer),
			definitions: this.game.cache.getJSON('definitions.json', false)
		});
	}
}
