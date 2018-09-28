import {Injectable} from '@angular/core';
import {DefaultEntity} from './phaser/entities/default-entity';
import {CCEntity} from './phaser/entities/cc-entity';
import {Prop} from './phaser/entities/prop';

@Injectable({
	providedIn: 'root'
})

export class EntityRegistryService {
	private entities: { [type: string]: any } = {};
	private defaultEntity: any;
	
	constructor() {
		this.setDefaultEntity(DefaultEntity);
		this.register('Prop', Prop);
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
