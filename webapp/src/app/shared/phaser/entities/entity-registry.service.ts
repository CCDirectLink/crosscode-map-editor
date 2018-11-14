import {Injectable} from '@angular/core';
import {DefaultEntity} from './default-entity';
import {CCEntity} from './cc-entity';
import {Prop} from './prop';
import {ScalableProp} from './scalable-prop';
import {ItemDestruct} from './item-destruct';

@Injectable({
	providedIn: 'root'
})

// TODO move shouldn't be a service
export class EntityRegistryService {
	private entities: { [type: string]: any } = {};
	private defaultEntity: any;
	
	constructor() {
		this.setDefaultEntity(DefaultEntity);
		this.register('Prop', Prop);
		this.register('ScalableProp', ScalableProp);
		this.register('ItemDestruct', ItemDestruct);
	}
	
	private setDefaultEntity(entity: any) {
		this.defaultEntity = entity;
	}
	
	private register(type: string, entity: any) {
		this.entities[type] = entity;
	}
	
	public getDefaultEntity(): new (...args) => CCEntity {
		return this.defaultEntity;
	}
	
	public getEntity(type: string): new (...args) => CCEntity {
		return this.entities[type] || this.defaultEntity;
	}
}
