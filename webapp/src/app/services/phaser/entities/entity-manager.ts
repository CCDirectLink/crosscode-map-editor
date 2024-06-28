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
	private deleteKey!: Phaser.Input.Keyboard.Key;
	private gridKey!: Phaser.Input.Keyboard.Key;
	private visibilityKey!: Phaser.Input.Keyboard.Key;
	private leftPointerDown = false;
	private rightPointerDown = false;
	
	private skipEdit = false;
	
	private copyListener = async () => {
		if (Helper.isInputFocused()) {
			return;
		}
		await this.copy();
	};
	
	private pasteListener = async () => {
		if (Helper.isInputFocused()) {
			return;
		}
		await this.paste();
	};
	
	private cutListener = async () => {
		if (Helper.isInputFocused()) {
			return;
		}
		await this.copy();
		this.deleteSelectedEntities();
	};
	
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
		this.multiSelectKey = keyboard!.addKey(keyCodes.SHIFT, false);
		this.deleteKey = keyboard!.addKey(keyCodes.DELETE, false);
		this.gridKey = keyboard!.addKey(keyCodes.G, false);
		this.visibilityKey = keyboard!.addKey(keyCodes.R, false);
		
		this.selectionBox = new SelectionBox(this.scene);
	}
	
	
	protected deactivate() {
		document.removeEventListener('copy', this.copyListener);
		document.removeEventListener('paste', this.pasteListener);
		document.removeEventListener('cut', this.cutListener);
		
		this.selectEntity();
		this._entities.forEach(entity => {
			entity.setActive(false);
			entity.setSelected(false);
		});
	}
	
	protected activate() {
		document.addEventListener('copy', this.copyListener);
		document.addEventListener('paste', this.pasteListener);
		document.addEventListener('cut', this.cutListener);
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
				if (pointer.rightButtonDown()) {
					this.rightPointerDown = true;
				}
				if (!pointer.leftButtonDown()) {
					return;
				}
				this.leftPointerDown = true;
				
				
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
		
		const pointerUpFun = (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject[]) => {
			if (pointer.rightButtonReleased() && this.rightPointerDown) {
				this.rightPointerDown = false;
				this.selectEntity();
				this.showAddEntityMenu();
			} else if (pointer.leftButtonReleased() && this.leftPointerDown) {
				this.leftPointerDown = false;
				this.selectedEntities.forEach(entity => {
					entity.isDragged = false;
				});
				
				// if panning do not deselect entities
				if (Globals.panning) {
					return;
				}
				
				if (this.gameObjectDown) {
					this.gameObjectDown = false;
					Globals.stateHistoryService.saveState({
						name: 'Entity moved',
						icon: 'open_with'
					});
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
		};
		
		this.addKeybinding({
			event: 'pointerup',
			fun: pointerUpFun,
			emitter: this.scene.input
		});
		
		this.addKeybinding({
			event: 'pointerupoutside',
			fun: pointerUpFun,
			emitter: this.scene.input
		});
		
		this.addKeybinding({
			event: 'up',
			emitter: this.gridKey,
			fun: () => {
				if (Helper.isInputFocused()) {
					return;
				}
				Globals.gridSettings.update(settings => ({
					...settings,
					enableGrid: !settings.enableGrid
				}));
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
	
	async copy() {
		const entities = this.selectedEntities.map(v => v.exportEntity());
		if (entities.length === 0) {
			return;
		}
		await navigator.clipboard.writeText(JSON.stringify(entities));
		Globals.snackbar.open('copied entity to clipboard', undefined, {duration: 1000});
		
	}
	
	isMapEntity(obj: Partial<MapEntity> | undefined): obj is MapEntity {
		return typeof obj?.type === 'string' && typeof obj.x === 'number' && typeof obj.settings === 'object';
	}
	
	async paste() {
		if (!this.map) {
			return;
		}
		const json = await navigator.clipboard.readText();
		let entities: MapEntity[] = [];
		try {
			let parsed = JSON.parse(json);
			if (!Array.isArray(parsed)) {
				parsed = [parsed];
			}
			entities = (parsed as any[]).filter(v => this.isMapEntity(v));
		} catch (e) {
			Globals.snackbar.open('could not parse entities from clipboard', undefined, {duration: 2000});
			return;
		}
		if (entities.length === 0) {
			return;
		}
		const offset = Vec2.createC(entities[0].x, entities[0].y);
		const level = entities[0].level;
		let levelOffset = 0;
		if (typeof level === 'number') {
			levelOffset = this.map.levels[level]?.height ?? 0;
		} else if (typeof level !== 'string') {
			levelOffset = this.map.levels[level.level]?.height ?? 0;
		}
		offset.y -= levelOffset;
		const mousePos = Helper.getPointerPos(this.scene.input.activePointer);
		this.selectEntity();
		
		for (const e of entities) {
			e.settings.mapId = undefined;
			Vec2.sub(e, offset);
			Vec2.add(e, mousePos);
			const newEntity = await this.generateEntity(e);
			newEntity.setActive(true);
			this.selectEntity(newEntity, entities.length > 1);
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
