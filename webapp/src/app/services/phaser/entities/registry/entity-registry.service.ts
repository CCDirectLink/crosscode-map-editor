import { Injectable } from '@angular/core';
import { CCEntity } from '../cc-entity';
import { DefaultEntity } from './default-entity';
import { Destructible } from './destructible';
import { Enemy } from './enemy';
import { EventTrigger } from './event-trigger';
import { ItemDestruct } from './item-destruct';
import { NPC } from './npc';
import { Prop } from './prop';
import { ScalableProp } from './scalable-prop';

@Injectable({
	providedIn: 'root'
})
export class EntityRegistryService {
	private entities: { [type: string]: typeof CCEntity } = {};
	
	constructor() {
		this.register('Prop', Prop);
		this.register('ScalableProp', ScalableProp);
		this.register('ItemDestruct', ItemDestruct);
		this.register('Destructible', Destructible);
		this.register('NPC', NPC);
		this.register('EventTrigger', EventTrigger);
		this.register('Enemy', Enemy);
	}
	
	private register(type: string, entity: typeof CCEntity) {
		this.entities[type] = entity;
	}
	
	public getDefaultEntity(): typeof DefaultEntity {
		return DefaultEntity;
	}

	public getAll() {
		return this.entities;
	}
	
	// typed as DefaultEntity so constructor can be used with parameter checking.
	// CCEntity is abstract and doesn't allow using the constructor
	public getEntity(type: string): typeof DefaultEntity {
		return (this.entities[type] ?? DefaultEntity) as typeof DefaultEntity;
	}
}
