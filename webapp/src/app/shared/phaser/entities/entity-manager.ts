import {CCEntity} from './cc-entity';
import {CrossCodeMap, MapEntity, Point} from '../../../models/cross-code-map';
import {Vec2} from '../vec2';
import {Globals} from '../../globals';
import {SelectionBox} from './selection-box';
import {BaseObject} from '../base-object';
import {Helper} from '../helper';

export class EntityManager extends BaseObject {
	
	private map?: CrossCodeMap;
	private entities: CCEntity[] = [];
	
	private multiSelectKey!: Phaser.Input.Keyboard.Key;
	private copyKey!: Phaser.Input.Keyboard.Key;
	private pasteKey!: Phaser.Input.Keyboard.Key;
	private deleteKey!: Phaser.Input.Keyboard.Key;
	private gridKey!: Phaser.Input.Keyboard.Key;
	private visibilityKey!: Phaser.Input.Keyboard.Key;
	
	private leftClickOpts: {
		timer: number;
		pos: Point;
	} = {
		timer: 0,
		pos: {x: 0, y: 0}
	};
	
	private selectedEntities: CCEntity[] = [];
	private copyEntities: CCEntity[] = [];
	
	private gameObjectDown = false;
	
	private selectionBox!: SelectionBox;
	
	constructor(
		scene: Phaser.Scene,
		active = true
	) {
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
		
		this.selectionBox = new SelectionBox(this.scene);
	}
	
	
	protected deactivate() {
		this.selectEntity();
		this.entities.forEach(entity => {
			entity.setActive(false);
			entity.setSelected(false);
		});
	}
	
	protected activate() {
		this.entities.forEach(entity => {
			entity.setActive(true);
		});
		const sub2 = Globals.globalEventsService.selectedEntity.subscribe(entity => {
			this.selectedEntities.forEach(e => e.setSelected(false));
			this.selectedEntities = [];
			if (entity) {
				entity.setSelected(true);
				this.selectedEntities.push(entity);
			}
		});
		this.addSubscription(sub2);
		
		const sub3 = Globals.globalEventsService.generateNewEntity.subscribe(async entity => {
			if (!this.map) {
				return;
			}
			// TODO: better generate level from collision tiles
			entity.level = this.map.masterLevel;
			const e = await this.generateEntity(entity);
			
			// entity manager is activated
			e.setActive(true);
			this.selectEntity(e);
		});
		this.addSubscription(sub3);
		
		
		this.addKeybinding({
			event: 'pointerdown',
			fun: (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject[]) => {
				if (!pointer.leftButtonDown()) {
					return;
				}
				
				this.leftClickOpts.timer = 0;
				this.leftClickOpts.pos.x = pointer.worldX;
				this.leftClickOpts.pos.y = pointer.worldY;
				
				let entity;
				if (gameObject.length > 0) {
					entity = gameObject[0].getData('entity') as CCEntity;
				}
				
				if (entity) {
					this.gameObjectDown = true;
					
					// to allow instant drag of a single entity
					if (this.selectedEntities.indexOf(entity) < 0) {
						if (!this.multiSelectKey.isDown) {
							this.selectEntity(entity);
						}
					}
					this.selectedEntities.forEach(entity => {
						entity.startOffset.x = pointer.worldX - entity.container.x;
						entity.startOffset.y = pointer.worldY - entity.container.y;
						entity.isDragged = true;
					});
				} else {
					this.selectionBox.onInputDown(pointer);
				}
			},
			emitter: this.scene.input
		});
		
		this.addKeybinding({
			event: 'pointerup',
			fun: (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject[]) => {
				if (pointer.rightButtonReleased()) {
					this.selectEntity();
					this.showAddEntityMenu();
				} else if (pointer.leftButtonReleased()) {
					this.selectedEntities.forEach(entity => {
						entity.isDragged = false;
					});
					
					if (this.gameObjectDown) {
						this.gameObjectDown = false;
					} else {
						const entities = this.selectionBox.onInputUp();
						if (!this.multiSelectKey.isDown) {
							this.selectEntity();
						}
						entities.forEach(entity => {
							this.selectEntity(entity, true);
						});
					}
					
					let entity;
					if (gameObject.length > 0) {
						entity = gameObject[0].getData('entity');
					}
					if (entity) {
						console.log(entity);
						const p = {x: pointer.worldX, y: pointer.worldY};
						console.log('click check');
						if (this.leftClickOpts.timer < 200 && Vec2.distance2(p, this.leftClickOpts.pos) < 10) {
							console.log('click');
							this.selectEntity(entity, this.multiSelectKey.isDown);
						}
					}
				}
			},
			emitter: this.scene.input
		});
		
		this.addKeybinding({
			event: 'up',
			emitter: this.gridKey,
			fun: () => {
				if (Helper.isInputFocused()) {
					return;
				}
				Globals.entitySettings.enableGrid = !Globals.entitySettings.enableGrid;
			}
		});
		
		// TODO: still triggers when npc editor is open
		this.addKeybinding({
			event: 'up',
			emitter: this.deleteKey,
			fun: () => {
				if (Helper.isInputFocused()) {
					return;
				}
				this.deleteSelectedEntities();
			}
		});
		
		this.addKeybinding({
			event: 'up',
			emitter: this.copyKey,
			fun: (key: Phaser.Input.Keyboard.Key, event: KeyboardEvent) => {
				if (Helper.isInputFocused() || !event.ctrlKey) {
					return;
				}
				this.copy();
			}
		});
		
		this.addKeybinding({
			event: 'up',
			emitter: this.pasteKey,
			fun: (key: Phaser.Input.Keyboard.Key, event: KeyboardEvent) => {
				if (Helper.isInputFocused() || !event.ctrlKey) {
					return;
				}
				this.paste();
			}
		});
		
		this.addKeybinding({
			event: 'up',
			emitter: this.visibilityKey,
			fun: () => {
				if (Helper.isInputFocused()) {
					return;
				}
				this.entities.forEach(e => {
					e.container.visible = !e.container.visible;
				});
			}
		});
		
		
	}
	
	preUpdate(time: number, delta: number): void {
		this.leftClickOpts.timer += delta;
		this.selectionBox.update(this.entities);
	}
	
	/** generates all entities and adds proper input handling */
	async initialize(map?: CrossCodeMap) {
		this.map = map;
		if (this.entities) {
			this.entities.forEach(e => e.destroy());
		}
		this.entities = [];
		
		if (!map || !map.entities) {
			return;
		}
		
		for (const entity of map.entities) {
			await this.generateEntity(entity);
		}
	}
	
	
	selectEntity(entity?: CCEntity, multiple = false) {
		if (multiple) {
			if (!entity) {
				throw new Error('select entity is undefined, but multiple is true');
				
			}
			const i = this.selectedEntities.indexOf(entity as CCEntity);
			if (i >= 0) {
				entity.setSelected(false);
				this.selectedEntities.splice(i, 1);
			} else {
				entity.setSelected(true);
				this.selectedEntities.push(entity!);
			}
			
			if (this.selectedEntities.length === 1) {
				Globals.globalEventsService.selectedEntity.next(entity);
			}
		} else if (this.selectedEntities[0] !== entity || this.selectedEntities.length !== 1) {
			Globals.globalEventsService.selectedEntity.next(entity);
		}
	}
	
	async generateEntity(entity: MapEntity): Promise<CCEntity> {
		const entityClass = Globals.entityRegistry.getEntity(entity.type);
		
		const ccEntity = new entityClass(this.scene, this.map, entity.x, entity.y, entity.type);
		await ccEntity.setSettings(entity.settings);
		ccEntity.level = entity.level;
		ccEntity.setActive(false);
		this.entities.push(ccEntity);
		return ccEntity;
	}
	
	copy() {
		this.copyEntities = this.selectedEntities.slice();
	}
	
	paste() {
		if (this.copyEntities.length === 0 || !this.map) {
			return;
		}
		const offset = Vec2.create(this.copyEntities[0].container);
		offset.y -= this.map.levels[this.copyEntities[0].details.level.level].height;
		const mousePos = Helper.getPointerPos(this.scene.input.activePointer);
		this.selectEntity();
		
		this.copyEntities.forEach(async e => {
			const entityDef = e.exportEntity();
			Vec2.sub(entityDef, offset);
			Vec2.add(entityDef, mousePos);
			const newEntity = await this.generateEntity(entityDef);
			newEntity.setActive(true);
			this.selectEntity(newEntity, this.copyEntities.length > 1);
		});
	}
	
	deleteSelectedEntities() {
		this.selectedEntities.forEach(e => {
			const i = this.entities.indexOf(e);
			this.entities.splice(i, 1);
			e.destroy();
		});
		this.selectEntity();
	}
	
	exportEntities(): MapEntity[] {
		const out: MapEntity[] = [];
		this.entities.forEach(e => out.push(e.exportEntity()));
		return out;
	}
	
	private showAddEntityMenu() {
		
		Globals.globalEventsService.showAddEntityMenu.next(Helper.getPointerPos(this.scene.input.activePointer));
	}
}
