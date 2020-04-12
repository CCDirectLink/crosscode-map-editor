import {DefaultEntity} from './default-entity';
import {CCEntity} from '../cc-entity';
import {Prop} from './prop';
import {ScalableProp} from './scalable-prop';
import {ItemDestruct} from './item-destruct';
import {NPC} from './npc';
import {EventTrigger} from './event-trigger';
import {Injectable} from '@angular/core';
import { Enemy } from './enemy';

@Injectable()
export class EntityRegistryService {
	private entities: { [type: string]: any } = {};
	private defaultEntity: any;
	
	constructor() {
		this.setDefaultEntity(DefaultEntity);
		this.register('Prop', Prop);
		this.register('ScalableProp', ScalableProp);
		this.register('ItemDestruct', ItemDestruct);
		this.register('NPC', NPC);
		this.register('EventTrigger', EventTrigger);
		this.register('Enemy', Enemy)
	}
	
	private setDefaultEntity(entity: any) {
		this.defaultEntity = entity;
	}
	
	private register(type: string, entity: any) {
		this.entities[type] = entity;
	}
	
	public getDefaultEntity(): new (...args: any[]) => CCEntity {
		return this.defaultEntity;
	}
	
	public getAll() {
		return this.entities;
	}
	
	public getEntity(type: string): new (...args: any[]) => CCEntity {
		return this.entities[type] || this.defaultEntity;
	}
}
