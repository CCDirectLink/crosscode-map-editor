import { CrossCodeMap, MapEntity, Point } from '../../../models/cross-code-map';
import { Globals } from '../../globals';
import { BaseObject } from '../base-object';
import { Helper } from '../helper';
import { CCMap } from '../tilemap/cc-map';
import { Vec2 } from '../vec2';
import { CCEntity } from './cc-entity';
import { SelectionBox } from './selection-box';

export class EntityManager extends BaseObject {
	
	// TODO: If ? is really required, add a description why.
	private map?: CCMap;
	private _entities: CCEntity[] = [];
	get entities(): CCEntity[] {
		return this._entities;
	}
	
	private multiSelectKey!: Phaser.Input.Keyboard.Key;
	private copyKey!: Phaser.Input.Keyboard.Key;
	private pasteKey!: Phaser.Input.Keyboard.Key;
	private deleteKey!: Phaser.Input.Keyboard.Key;
	private gridKey!: Phaser.Input.Keyboard.Key;
	private visibilityKey!: Phaser.Input.Keyboard.Key;
	
	private skipEdit = false;
	
	private leftClickOpts: {
		prevTimer: number;
		prevEntity: CCEntity | undefined;
		entity: CCEntity | undefined;
		timer: number;
		pos: Point;
	} = {
			prevTimer: 0,
			prevEntity: undefined,
			entity: undefined,
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
		this._entities.forEach(entity => {
			entity.setActive(false);
			entity.setSelected(false);
		});
	}
	
	protected activate() {
		this._entities.forEach(entity => {
			entity.setActive(true);
		});
		const sub2 = Globals.globalEventsService.selectedEntity.subscribe(entity => {
			if (this.selectedEntities.length > 0 && !this.skipEdit) {
				Globals.stateHistoryService.saveState({
					name: 'Entity edited',
					icon: 'build',
				}, false);
			}
			this.skipEdit = false;
			this.selectedEntities.forEach(e => e.setSelected(false));
			this.selectedEntities = [];
			if (entity) {
				entity.setSelected(true);
				this.selectedEntities.push(entity);
			}
		});
		this.addSubscription(sub2);
		
		const sub3 = Globals.globalEventsService.generateNewEntity.subscribe(async entity => {
			await this.generateNewEntity(entity);
		});
		this.addSubscription(sub3);
		
		this.addKeybinding({
			event: 'pointerdown',
			fun: (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject[]) => {
				if (!pointer.leftButtonDown()) {
					return;
				}
				
				
				let entity;
				if (gameObject.length > 0) {
					entity = gameObject[0].getData('entity') as CCEntity;
				}
				
				this.leftClickOpts.prevTimer = this.leftClickOpts.timer;
				this.leftClickOpts.prevEntity = this.leftClickOpts.entity;
				this.leftClickOpts.timer = 0;
				this.leftClickOpts.entity = entity;
				this.leftClickOpts.pos.x = pointer.worldX;
				this.leftClickOpts.pos.y = pointer.worldY;
				
				// if panning return once entity as been selected to prevent dragging of selected entities
				if (Globals.panning) {
					return;
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

					// if panning do not deselect entities
					if (Globals.panning) {
						return;
					}
					
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
						entity = gameObject[0].getData('entity') as CCEntity;
					}
					if (entity) {
						console.log(entity);
						const p = {x: pointer.worldX, y: pointer.worldY};
						if (this.leftClickOpts.timer < 200 && Vec2.distance2(p, this.leftClickOpts.pos) < 10) {
							this.selectEntity(entity, this.multiSelectKey.isDown);

							if (!this.multiSelectKey.isDown && this.leftClickOpts.prevEntity === this.leftClickOpts.entity && this.leftClickOpts.prevTimer < 500) {
								entity.doubleClick();
							}
						} else {
							//Reset double click after drag
							this.leftClickOpts.entity = undefined;
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

				//TODO: investigate this bug where the keyup event is sometimes completely dropped or called twice (second time with event.currentTarget = null)
				event.stopPropagation();
				event.preventDefault();

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
				this.hideEntities();
			}
		});
		
		
	}
	
	preUpdate(time: number, delta: number): void {
		this.leftClickOpts.timer += delta;
		this.selectionBox.update(this._entities);
	}
	
	
	hideEntities() {
		this._entities.forEach(e => {
			e.container.visible = !e.container.visible;
		});
	}
	
	/** generates all entities and adds proper input handling */
	async initialize(map: CrossCodeMap, ccMap: CCMap) {
		this.map = ccMap;
		if (this._entities) {
			this._entities.forEach(e => e.destroy());
		}
		this._entities = [];
		
		if (!map.entities) {
			return;
		}
		
		// concurrent entity loading
		const promises: Promise<any>[] = []; 
		for (const entity of map.entities) {
			promises.push(this.generateEntity(entity));
		}
		await Promise.all(promises);
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
	
	public async generateNewEntity(entity: MapEntity): Promise<CCEntity | undefined> {
		if (!this.map) {
			return;
		}
		// TODO: better generate level from collision tiles
		entity.level = this.map.masterLevel;
		const e = await this.generateEntity(entity);
		
		// entity manager is activated
		e.setActive(true);
		this.selectEntity(e);
		
		Globals.stateHistoryService.saveState({
			name: 'Entity added',
			icon: 'add'
		}, true);
		
		return e;
	}
	
	async generateEntity(entity: MapEntity): Promise<CCEntity> {
		const entityClass = Globals.entityRegistry.getEntity(entity.type);
		console.assert(this.map, 'I dont think map is ever undefined, but if it ever happens check the TODO on private map?: CCMap;');
		const map = this.map!;
		const ccEntity = new entityClass(this.scene, map, entity.x, entity.y, entity.type);
		if (!entity.settings.mapId) {
			entity.settings.mapId = map.getUniqueMapid();
		}
		await ccEntity.setSettings(entity.settings);
		ccEntity.level = entity.level;
		ccEntity.setActive(false);
		this._entities.push(ccEntity);
		return ccEntity;
	}
	
	copy() {
		this.copyEntities = this.selectedEntities.slice();
	}
	
	async paste() {
		if (this.copyEntities.length === 0 || !this.map) {
			return;
		}
		const offset = Vec2.create(this.copyEntities[0].container);
		offset.y -= this.map.levels[this.copyEntities[0].details.level.level].height;
		const mousePos = Helper.getPointerPos(this.scene.input.activePointer);
		this.selectEntity();
		
		for (const e of this.copyEntities) {
			const entityDef = e.exportEntity();
			entityDef.settings.mapId = undefined;
			Vec2.sub(entityDef, offset);
			Vec2.add(entityDef, mousePos);
			const newEntity = await this.generateEntity(entityDef);
			newEntity.setActive(true);
			this.selectEntity(newEntity, this.copyEntities.length > 1);
		}
		
	}
	
	deleteSelectedEntities() {
		this.skipEdit = true;
		const saveHistory = this.selectedEntities.length > 0;
		this.selectedEntities.forEach(e => {
			const i = this._entities.indexOf(e);
			this._entities.splice(i, 1);
			e.destroy();
		});
		this.selectEntity();
		
		if (saveHistory) {
			Globals.stateHistoryService.saveState({
				name: 'Entity deleted',
				icon: 'delete'
			}, true);
		}
	}
	
	exportEntities(): MapEntity[] {
		const out: MapEntity[] = [];
		this._entities.forEach(e => out.push(e.exportEntity()));
		return out;
	}
	
	private showAddEntityMenu() {
		
		Globals.globalEventsService.showAddEntityMenu.next(Helper.getPointerPos(this.scene.input.activePointer));
	}
}
