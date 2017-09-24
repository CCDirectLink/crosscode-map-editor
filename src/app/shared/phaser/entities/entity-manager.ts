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
	private cancelSelectionKey: Phaser.DeviceButton;
	private inputEvents: InputEvents = {};
	private selectedEntities: CCEntity[];
	private globalEvents: GlobalEventsService;

	constructor(game: Phaser.Game, parent) {
		super(game, parent);
		this.active = true;
		this.hasUpdate = true;
		this.zIndex = 900;
		this.selectedEntities = [];
		this.multiSelectKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
		this.cancelSelectionKey = game.input.mousePointer.rightButton;

		this.inputEvents.onLeftClick = (e, pointer) => {
			// multi select
			if (this.multiSelectKey.isDown) {
				const i = this.selectedEntities.indexOf(e);
				// remove entity if already selected
				if (i >= 0) {
					e.setSelected(false);
					this.selectedEntities.splice(i, 1);
				} else {
					e.setSelected(true);
					this.selectedEntities.push(e);
				}
			} else {
				this.selectEntity(e);
			}

		};

		this.inputEvents.onInputDown = (e, pointer) => {
			if (pointer.leftButton.isDown) {
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
		const definitions = this.game.cache.getJSON('definitions.json', false);
		if (this.entities) {
			this.entities.forEach(e => e.destroy());
		}
		this.entities = [];

		if (mapInput.entities) {
			mapInput.entities.forEach(entity => {
				// if (entity.type === 'Prop' || entity.type === 'ScalableProp') {
				// 	return;
				// }
				const def: EntityDefinition = definitions[entity.type];
				def.type = entity.type;
				const ccEntity = new CCEntity(this.game, ccMap, entity.x, entity.y, def, this.inputEvents);
				ccEntity.settings = entity.settings;
				ccEntity.level = entity.level;
				this.entities.push(ccEntity);
			});
		}
	}

	selectEntity(entity: CCEntity) {
		if (this.selectedEntities[0] !== entity || this.selectedEntities.length !== 1) {
			this.globalEvents.selectedEntity.next(entity);
		}
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
