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

	private inputEvents: InputEvents = {};
	private selectedEntity: CCEntity;
	private globalEvents: GlobalEventsService;

	constructor(game: Phaser.Game, parent) {
		super(game, parent);
		this.active = true;
		this.hasUpdate = true;
		this.zIndex = 900;

		this.inputEvents.onInputDown = (e, pointer) => {
			console.log(e);
			if (pointer.leftButton.isDown) {
				this.selectEntity(e);
				e.startOffset = Vec2.sub(Helper.screenToWorld(this.game, pointer), e.group, true);
				e.isDragged = true;
			}
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
		if (this.selectedEntity !== entity) {
			this.globalEvents.selectedEntity.next(entity);
		}
	}

	setGlobalEvents(globalEvents: GlobalEventsService) {
		this.globalEvents = globalEvents;
		this.globalEvents.selectedEntity.subscribe(entity => {
			if (this.selectedEntity) {
				this.selectedEntity.setSelected(false);
			}
			this.selectedEntity = entity;
			if (entity) {
				entity.setSelected(true);
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
		this.keyBindings.push(this.game.input.mousePointer.leftButton.onDown.add(() => this.selectEntity(null)));
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
