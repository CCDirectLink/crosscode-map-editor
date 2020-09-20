import { DefaultEntity } from './default-entity';
import { Prop } from './prop';
import { ScalableProp } from './scalable-prop';
import { ItemDestruct } from './item-destruct';
import { NPC } from './npc';
import { EventTrigger } from './event-trigger';
import { Injectable } from '@angular/core';
import { Destructible } from './destructible';
import { CCEntity } from '../cc-entity';

@Injectable()
export class EntityRegistryService {
	private entities: { [type: string]: typeof CCEntity } = {};
	
	constructor() {
		this.register('Prop', Prop);
		this.register('ScalableProp', ScalableProp);
		this.register('ItemDestruct', ItemDestruct);
		this.register('Destructible', Destructible);
		this.register('NPC', NPC);
		this.register('EventTrigger', EventTrigger);
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
