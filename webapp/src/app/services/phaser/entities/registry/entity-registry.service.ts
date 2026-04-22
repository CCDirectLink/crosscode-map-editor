import { Injectable } from '@angular/core';
import { CCEntity } from '../cc-entity';
import { BallChanger } from './ball-changer';
import { Blocker } from './blocker';
import { BounceBlock } from './bounce-block';
import { Chest } from './chest';
import { CompressorBouncer } from './compressor-bouncer';
import { DefaultEntity } from './default-entity';
import { Destructible } from './destructible';
import { Door } from './door';
import { DynamicPlatform } from './dynamic-platform';
import { ElementPole } from './element-pole';
import { ElementPoleDest } from './element-pole-dest';
import { ElementShieldSrc } from './element-shield-src';
import { Enemy } from './enemy';
import { EnemyCounter } from './enemy-counter';
import { EventTrigger } from './event-trigger';
import { ItemDestruct } from './item-destruct';
import { KeyPanel } from './key-panel';
import { Lorry } from './lorry';
import { LorryRail } from './lorry-rail';
import { Magnet } from './magnet';
import { NPC } from './npc';
import { OneTimeSwitch } from './one-time-switch';
import { Prop } from './prop';
import { PushPullBlock } from './push-pull-block';
import { RegenDestruct } from './regen-destruct';
import { ScalableProp } from './scalable-prop';
import { SteamPipe } from './steam-pipe';
import { SteamTurnout } from './steam-turnout';
import { TeleportField } from './teleport-field';
import { TeleportStairs } from './teleport-stairs';
import { TeslaCoil } from './tesla-coil';
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
		this.register('Chest', Chest);
		this.register('KeyPanel', KeyPanel);
		this.register('Lorry', Lorry);
		this.register('LorryRail', LorryRail);
		this.register('ElementPole', ElementPole);
		this.register('ElementPoleDest', ElementPoleDest);
		this.register('ElementShieldSrc', ElementShieldSrc);
		this.register('NPC', NPC);
		this.register('EventTrigger', EventTrigger);
		this.register('Enemy', Enemy);
		this.register('EnemyCounter', EnemyCounter);
		this.register('Door', Door);
		this.register('OneTimeSwitch', OneTimeSwitch);
		this.register('SteamPipe', SteamPipe);
		this.register('SteamTurnout', SteamTurnout);
		this.register('TeleportField', TeleportField);
		this.register('TeleportStairs', TeleportStairs);
		this.register('TeslaCoil', TeslaCoil);
		this.register('WallHorizontal', WallHorizontal);
		this.register('WallVertical', WallVertical);
		this.register('PushPullBlock', PushPullBlock);
		this.register('Blocker', Blocker);
		this.register('DynamicPlatform', DynamicPlatform);
		this.register('Magnet', Magnet);
		this.register('CompressorBouncer', CompressorBouncer);
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
