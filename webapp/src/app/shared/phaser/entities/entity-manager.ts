import {CCEntity, InputEvents} from './cc-entity';
import {Sortable} from '../../../models/sortable';
import {Helper} from '../helper';
import {CCMap} from '../tilemap/cc-map';
import {CrossCodeMap, MapEntity} from '../../../models/cross-code-map';
import {Vec2} from '../vec2';
import {GlobalEventsService} from '../../global-events.service';
import {Globals} from '../../globals';
import {SelectionBox} from './selection-box';
import {EntityRegistry} from './registry/entity-registry';
import {BaseObject} from '../BaseObject';

enum MouseButtons {
	Left,
	Right,
	Middle
}

export class EntityManager extends BaseObject {
	
	private map?: CCMap;
	private entities: CCEntity[] = [];
	
	private multiSelectKey!: Phaser.Input.Keyboard.Key;
	private copyKey!: Phaser.Input.Keyboard.Key;
	private pasteKey!: Phaser.Input.Keyboard.Key;
	private deleteKey!: Phaser.Input.Keyboard.Key;
	private gridKey!: Phaser.Input.Keyboard.Key;
	private visibilityKey!: Phaser.Input.Keyboard.Key;
	
	private inputEvents: InputEvents = {};
	private selectedEntities: CCEntity[] = [];
	// private copyEntities: CCEntity[];
	// private globalEvents: GlobalEventsService;
	
	// private selectionBox: SelectionBox;
	
	private entityRegistry: EntityRegistry = new EntityRegistry();
	
	constructor(scene: Phaser.Scene, active = true) {
		super(scene, 'entityManager', active);
	}
	
	protected init(): void {
		const keyboard = this.scene.input.keyboard;
		const keyCodes = Phaser.Input.Keyboard.KeyCodes;
		this.multiSelectKey = keyboard.addKey(keyCodes.SHIFT, false);
		this.copyKey = keyboard.addKey(keyCodes.C, false);
		this.pasteKey = keyboard.addKey(keyCodes.V, false);
		this.deleteKey = keyboard.addKey(keyCodes.DELETE, false);
		this.gridKey = keyboard.addKey(keyCodes.G, false);
		this.visibilityKey = keyboard.addKey(keyCodes.R, false);
		
		// this.selectionBox = new SelectionBox(this.game);
		
		Globals.mapLoaderService.tileMap.subscribe(map => {
			console.log('map loadedddas' + map);
			this.initialize(map);
		});
	}
	
	
	protected deactivate() {
		// this.inputImg.inputEnabled = false;
		// if (!this.map) {
		// 	return;
		// }
		// this.selectEntity(null);
		// this.entities.forEach(entity => {
		// 	entity.setEnableInput(false);
		// 	entity.setSelected(false);
		// });
	}
	
	protected activate() {
		let buttonPressed: MouseButtons;
		
		const sub2 = Globals.globalEventsService.selectedEntity.subscribe(entity => {
			this.selectedEntities.forEach(e => e.setSelected(false));
			this.selectedEntities = [];
			if (entity) {
				entity.setSelected(true);
				this.selectedEntities.push(entity);
			}
		});
		this.addSubscription(sub2);
		
		const sub3 = Globals.globalEventsService.generateNewEntity.subscribe(entity => {
			if (!this.map) {
				return;
			}
			// TODO: better generate level from collision tiles
			entity.level = this.map.masterLevel;
			const e = this.generateEntity(entity);
			
			// level offset
			// const offset = this.map.levels[e.details.level.level];
			// e.y += offset.height;
			
			// entity manager is activated
			e.setEnableInput(true);
			this.selectEntity(e);
		});
		this.addSubscription(sub3);
		
		
		this.addKeybinding({
			event: 'pointerdown',
			fun: (pointer: Phaser.Input.Pointer) => {
				if (pointer.middleButtonDown()) {
					buttonPressed = MouseButtons.Middle;
				} else if (pointer.leftButtonDown()) {
					buttonPressed = MouseButtons.Left;
					// this.selectionBox.onInputDown(Helper.screenToWorld(pointer));
				} else if (pointer.rightButtonDown()) {
					buttonPressed = MouseButtons.Right;
				}
				
				
				console.log(buttonPressed);
			},
			emitter: this.scene.input
		});
		
		this.addKeybinding({
			event: 'pointerup',
			fun: (pointer: Phaser.Input.Pointer) => {
				if (buttonPressed === MouseButtons.Right) {
					// this.selectEntity(null);
					// this.showAddEntityMenu();
				} else if (buttonPressed === MouseButtons.Left) {
					// const entities = this.selectionBox.onInputUp();
					// if (!this.multiSelectKey.isDown) {
					// 	this.selectEntity(null, false);
					// }
					// entities.forEach(entity => {
					// 	this.selectEntity(entity, true);
					// });
				}
			},
			emitter: this.scene.input
		});
		
		//
		// this.inputEvents.onLeftClick = (e, pointer) => {
		// 	this.selectEntity(e, this.multiSelectKey.isDown);
		// };
		//
		// this.inputEvents.onInputDown = (e, pointer) => {
		// 	if (pointer.leftButton.isDown) {
		// 		// to allow instant drag of a single entity
		// 		if (this.selectedEntities.indexOf(e) < 0) {
		// 			if (!this.multiSelectKey.isDown) {
		// 				this.selectEntity(e);
		// 			}
		// 		}
		// 		this.selectedEntities.forEach(entity => {
		// 			entity.startOffset = Vec2.sub(Helper.screenToWorld(pointer), entity.group, true);
		// 			entity.isDragged = true;
		// 		});
		// 	}
		// };
		// this.inputEvents.onInputUp = (e, pointer, isOver) => {
		// 	this.selectedEntities.forEach(entity => {
		// 		entity.isDragged = false;
		// 	});
		// };
		// this.inputImg.inputEnabled = true;
		// this.inputImg.input.priorityID = 1;
		//
		// this.keyBindings.push(this.gridKey.onDown.add(() => {
		// 	console.log('grid key down');
		// 	console.log(Helper.isInputFocused());
		// 	if (Helper.isInputFocused()) {
		// 		return;
		// 	}
		// 	Globals.entitySettings.enableGrid = !Globals.entitySettings.enableGrid;
		// }));
		// this.keyBindings.push(this.deleteKey.onDown.add(() => {
		// 	if (Helper.isInputFocused()) {
		// 		return;
		// 	}
		// 	this.deleteSelectedEntities();
		// }));
		// this.keyBindings.push(this.copyKey.onDown.add(() => {
		// 	if (!this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
		// 		return;
		// 	}
		// 	if (Helper.isInputFocused()) {
		// 		return;
		// 	}
		// 	this.copy();
		// }));
		// this.keyBindings.push(this.pasteKey.onDown.add(() => {
		// 	if (!this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL)) {
		// 		return;
		// 	}
		// 	if (Helper.isInputFocused()) {
		// 		return;
		// 	}
		// 	this.paste();
		// }));
		// this.keyBindings.push(this.visibilityKey.onDown.add(() => {
		// 	if (Helper.isInputFocused()) {
		// 		return;
		// 	}
		// 	this.entities.forEach(e => {
		// 		e.group.visible = !e.group.visible;
		// 	});
		// }));
		//
		// if (!this.map) {
		// 	return;
		// }
		// this.entities.forEach(entity => {
		// 	entity.setEnableInput(true);
		// });
	}
	
	preUpdate(): void {
		// this.selectionBox.update(this.entities);
	}
	
	/** generates all entities and adds proper input handling */
	initialize(ccMap?: CCMap) {
		this.map = ccMap;
		if (this.entities) {
			this.entities.forEach(e => e.destroy());
		}
		this.entities = [];
		
		if (ccMap && ccMap.loadedDetails && ccMap.loadedDetails.entities) {
			ccMap.loadedDetails.entities.forEach(entity => this.generateEntity(entity));
		}
	}
	
	
	selectEntity(entity: CCEntity, multiple = false) {
		// if (multiple) {
		// 	const i = this.selectedEntities.indexOf(entity);
		// 	if (i >= 0) {
		// 		entity.setSelected(false);
		// 		this.selectedEntities.splice(i, 1);
		// 	} else {
		// 		entity.setSelected(true);
		// 		this.selectedEntities.push(entity);
		// 	}
		// 	if (this.selectedEntities.length === 1) {
		// 		this.globalEvents.selectedEntity.next(entity);
		// 	}
		// } else if (this.selectedEntities[0] !== entity || this.selectedEntities.length !== 1) {
		// 	this.globalEvents.selectedEntity.next(entity);
		// }
	}
	
	generateEntity(entity: MapEntity): CCEntity {
		const entityClass = this.entityRegistry.getEntity(entity.type);
		
		const ccEntity = new entityClass(this.scene, this.map, entity.x, entity.y, this.inputEvents, entity.type);
		ccEntity.setSettings(entity.settings);
		ccEntity.level = entity.level;
		this.entities.push(ccEntity);
		return ccEntity;
	}
	
	copy() {
		// console.log(Helper.isInputFocused());
		// this.copyEntities = this.selectedEntities.slice();
	}
	
	paste() {
		// if (this.copyEntities.length === 0) {
		// 	return;
		// }
		// const offset = Vec2.create(this.copyEntities[0].group);
		// offset.y -= this.map.levels[this.copyEntities[0].details.level.level].height;
		// const mousePos = Vec2.create(Helper.screenToWorld(this.game.input.mousePointer));
		// this.selectEntity(null);
		//
		// this.copyEntities.forEach(e => {
		// 	const entityDef = e.exportEntity();
		// 	Vec2.sub(entityDef, offset);
		// 	Vec2.add(entityDef, mousePos);
		// 	const newEntity = this.generateEntity(entityDef);
		// 	newEntity.setEnableInput(true);
		// 	this.selectEntity(newEntity, this.copyEntities.length > 1);
		// });
		//
		// console.log(this.entities);
	}
	
	deleteSelectedEntities() {
		// this.selectedEntities.forEach(e => {
		// 	const i = this.entities.indexOf(e);
		// 	this.entities.splice(i, 1);
		// 	e.destroy();
		// });
		// this.selectEntity(null);
	}
	
	exportEntities(): MapEntity[] {
		const out: MapEntity[] = [];
		// this.entities.forEach(e => out.push(e.exportEntity()));
		return out;
	}
	
	// private showAddEntityMenu() {
	// 	this.globalEvents.showAddEntityMenu.next({
	// 		worldPos: Helper.screenToWorld(this.game.input.mousePointer),
	// 		// TODO: remove definitions.json, use entity registry instead
	// 		definitions: this.game.cache.getJSON('definitions.json', false)
	// 	});
	// }
}
