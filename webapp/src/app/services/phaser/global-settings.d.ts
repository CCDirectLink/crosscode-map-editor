import { Point } from '../../models/cross-code-map';
import { EnemyInfo } from './entities/registry/enemy';

export namespace GlobalSettings {
	
	export interface GlobalSettings {
		ENTITY: Entity;
	}
	
	export interface Entity {
		ItemDestruct: Record<string, ItemDestruct>;
		JumpPanel: JumpPanel;
		HiddenBlock: HiddenBlock;
	}
	
	export interface ItemDestruct {
		desType: string;
		items: Item[];
		_globalSettingKey: string;
		enemyInfo?: EnemyInfo;
		perma?: boolean;
	}
	
	export interface Item {
		id: string;
		prob: number;
	}
	
	// everything below here is probably useless
	export interface HiddenBlock {
		'ramp-north': RampNorth;
	}
	
	export interface RampNorth {
		size: Point;
		shape: string;
		heightShape: string;
		zHeight: number;
		terrain: string;
	}
	
	export interface JumpPanel {
		jump4: Jump;
		jump2: Jump;
	}
	
	export interface Jump {
		jumpHeight: string;
	}
}
