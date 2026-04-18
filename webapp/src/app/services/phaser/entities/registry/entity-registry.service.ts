import { Injectable } from '@angular/core';
import { CCEntity } from '../cc-entity';
import { BallChanger } from './ball-changer';
import { BounceBlock } from './bounce-block';
import { DefaultEntity } from './default-entity';
import { Destructible } from './destructible';
import { Door } from './door';
import { ElementPole } from './element-pole';
import { ElementPoleDest } from './element-pole-dest';
import { Enemy } from './enemy';
import { EventTrigger } from './event-trigger';
import { ItemDestruct } from './item-destruct';
import { KeyPanel } from './key-panel';
import { NPC } from './npc';
import { OneTimeSwitch } from './one-time-switch';
import { Prop } from './prop';
import { RegenDestruct } from './regen-destruct';
import { ScalableProp } from './scalable-prop';
import { SteamPipe } from './steam-pipe';
import { SteamTurnout } from './steam-turnout';
import { TeleportStairs } from './teleport-stairs';
import { WallHorizontal } from './wall-horizontal';
import { WallVertical } from './wall-vertical';
import { WaterBlock } from './water-block';

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
		this.register('RegenDestruct', RegenDestruct);
		this.register('BounceBlock', BounceBlock);
		this.register('BallChanger', BallChanger);
		this.register('WaterBlock', WaterBlock);
		this.register('KeyPanel', KeyPanel);
		this.register('ElementPole', ElementPole);
		this.register('ElementPoleDest', ElementPoleDest);
		this.register('NPC', NPC);
		this.register('EventTrigger', EventTrigger);
		this.register('Enemy', Enemy);
		this.register('Door', Door);
		this.register('OneTimeSwitch', OneTimeSwitch);
		this.register('SteamPipe', SteamPipe);
		this.register('SteamTurnout', SteamTurnout);
		this.register('TeleportStairs', TeleportStairs);
		this.register('WallHorizontal', WallHorizontal);
		this.register('WallVertical', WallVertical);
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
