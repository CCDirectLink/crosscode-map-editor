import {Mesh, Scene} from '@babylonjs/core';
import {CCEntity} from '../../phaser/entities/cc-entity';
import {Globals} from '../../globals';
import {Subscription} from 'rxjs';
import {EntityGenerator} from './entity-generator';

const EDGE_WIDTH = 6;

export class EntityManager3d {
	
	private meshMap = new Map<Mesh, CCEntity>();
	private entityMap = new Map<CCEntity, Mesh>();
	private prevSelected?: Mesh;
	private sub?: Subscription;
	
	/** Called after all entities are added */
	init(entityGenerator: EntityGenerator, scene: Scene) {
		for (const [mesh, entity] of this.meshMap) {
			if (entity.selected) {
				this.onClick(mesh);
				break;
			}
		}
		
		this.sub = Globals.globalEventsService.updateEntitySettings.subscribe(async entity => {
			await entityGenerator.generateEntity(entity, scene);
			const m = this.entityMap.get(entity)!;
			m.edgesWidth = EDGE_WIDTH;
			this.prevSelected = m;
		});
	}
	
	destroy() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
	}
	
	onClick(m: Mesh) {
		if (this.prevSelected) {
			this.select(this.prevSelected, false);
		}
		this.select(m, true);
		this.prevSelected = m;
	}
	
	select(m: Mesh, activate: boolean) {
		if (activate) {
			m.edgesWidth = EDGE_WIDTH;
			const entity = this.meshMap.get(m);
			if (!entity) {
				throw new Error('entity should allways exist');
			}
			Globals.globalEventsService.selectedEntity.next(entity);
			
		} else {
			m.edgesWidth = 0;
		}
	}
	
	registerEntity(entity: CCEntity, m: Mesh) {
		this.meshMap.set(m, entity);
		const prev = this.entityMap.get(entity);
		if (prev) {
			prev.dispose();
		}
		this.entityMap.set(entity, m);
	}
}
