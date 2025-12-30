import { SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PartialPoint3, Point, Point3 } from '../../../../models/cross-code-map';
import { Label } from '../../../../models/events';
import { ColorService } from '../../../../services/color.service';
import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';

export type WMTypeNames = 'Action'
	| 'Actor'
	| 'Analyzable'
	| 'AnimSheetRef'
	| 'Animation'
	| 'Area'
	| 'Array'
	| 'AttackInfo'
	| 'BallChangerType'
	| 'Boolean'
	| 'BooleanExpression'
	| 'BounceAction'
	| 'CallEvent'
	| 'Character'
	| 'ChoiceOptions'
	| 'CollabLabelFilter'
	| 'Color'
	| 'CombatConditions'
	| 'CondAnims'
	| 'CreditsTriggerSelect'
	| 'DoorVariations'
	| 'DropSelect'
	| 'DynamicPlatformDests'
	| 'Effect'
	| 'EffectSelect'
	| 'ElevatorDests'
	| 'EnemyActionRef'
	| 'EnemySearch'
	| 'EnemyState'
	| 'EnemyType'
	| 'EnemyTypeList'
	| 'Entity'
	| 'EntityAnim'
	| 'EntityAnimArray'
	| 'Event'
	| 'EventLoadCondition'
	| 'EventSheetCall'
	| 'Face'
	| 'FlexibleTable'
	| 'GUI'
	| 'GUIState'
	| 'GuiState'
	| 'Image'
	| 'Integer'
	| 'Item'
	| 'ItemsDropRate'
	| 'Landmarks'
	| 'LangLabel'
	| 'LoreEntrySelect'
	| 'LoreSelect'
	| 'LorryAltTypes'
	| 'MagnetAltDirs'
	| 'Maps'
	| 'Marker'
	| 'ModalChoiceOptions'
	| 'NPC'
	| 'NPCStates'
	| 'Number'
	| 'NumberExpression'
	| 'NumberVary'
	| 'Object'
	| 'Offset'
	| 'OlPlatformStates'
	| 'PersonExpression'
	| 'PoiFilter'
	| 'PropInteract'
	| 'PropType'
	| 'ProxyRef'
	| 'Quest'
	| 'QuestHub'
	| 'QuestLabelSelect'
	| 'QuestNameSelect'
	| 'QuestResetSelect'
	| 'QuestRewards'
	| 'QuestTaskList'
	| 'RandomDistribution'
	| 'Reaction'
	| 'ScalablePropConfig'
	| 'Select'
	| 'Shield'
	| 'Shop'
	| 'SoundT'
	| 'String'
	| 'StringExpression'
	| 'TaskIndex'
	| 'TileSheet'
	| 'Timer'
	| 'TrackerRef'
	| 'TraderSelect'
	| 'TrophySelect'
	| 'VarCondition'
	| 'VarName'
	| 'Vec2'
	| 'Vec2Expression'
	| 'Vec3'
	| 'Vec3Expression'
	| 'WalkAnimConfig'
	| 'XenoDialog';


export namespace WMTypes {
	export type VarExpression<T> =
		T |
		{ indirect: string } |
		{ varName: string } |
		{ actorAttrib: string }
		;

	export type Color = string;

	export type Vec2 = Point;
	export type Vec2Expression = VarExpression<Vec2>;
	export type Vec3 = PartialPoint3 & { lvl?: number };
	export type Vec3Expression = VarExpression<Vec3>;

	export type NumberExpression = VarExpression<number>;
	export type StringExpression = VarExpression<string>;
	export type BooleanExpression = VarExpression<boolean>;

	export type Offset = Point3;

	export type VarName = string | {
		actorAttrib?: string;
		indirect?: string;
	};

	export interface Entity {
		player?: boolean;
		self?: boolean;
		name?: string;
		varName?: string;
		party?: string;
	}

	export interface EnemyType {
		type: string;
	}

	export interface Effect {
		sheet: string;
		name: string;
	}

	export interface Animation {
		sheet: string;
		name: string;
	}
}

export interface EventType {
	type: string;
}

export interface EventTypeChild {
	title?: string;
	draggable?: boolean;
	events: AbstractEvent<any>[];
}

export abstract class AbstractEvent<T extends EventType> {

	public info = '---';
	public children: EventTypeChild[] = [];

	private colorService = new ColorService();

	constructor(
		private domSanitizer: DomSanitizer,
		public data: T,
		public actionStep = false,
	) {
	}

	protected abstract generateNewDataInternal(): { [key: string]: any };

	public generateNewData() {
		const data = this.generateNewDataInternal();
		data['type'] = this.data.type;
		this.data = data as any;
	}

	public abstract getAttributes(): EntityAttributes | undefined;

	public abstract update(): void;

	public export(): T {
		return JSON.parse(JSON.stringify(this.data));
	}

	protected combineStrings(...values: string[]): string {
		return values.join(' ');
	}

	protected getAllPropStrings(): string {
		const keys = Object.keys(this.data);
		return keys
			.filter(key => key !== 'type')
			.map(key => this.getPropString(key))
			.join(' ');
	}

	protected getPropString(key: string, value?: any): string {
		if (value === undefined) {
			value = this.data[key as keyof T];
		}
		const attr = this.getAttributes();
		if (attr && attr[key]) {
			const type = attr[key].type;
			switch (type as WMTypeNames) {
				case 'Color':
					value = this.getColorRectangle(value as WMTypes.Color);
					break;
				case 'Vec2':
				case 'Vec2Expression': {
					value = this.getVarExpressionValue(value as WMTypes.Vec2Expression, true);
					if (typeof value !== 'string') {
						const vec2 = value as WMTypes.Vec2;
						value = this.getVec2String(vec2.x, vec2.y);
					}
					break;
				}
				case 'Vec3':
				case 'Vec3Expression':
					value = this.getVarExpressionValue(value as WMTypes.Vec3Expression, true);
					if (typeof value !== 'string') {
						const vec3 = value as WMTypes.Vec3;
						value = this.getVec3String(vec3.x, vec3.y, vec3.z, vec3.lvl);
					}
					break;
				case 'Offset':
					if (value) {
						const offset = value as WMTypes.Offset;
						value = this.getVec3String(offset.x, offset.y, offset.z);
					}
					break;
				case 'Entity': {
					const entity = value as WMTypes.Entity;
					if (entity.player) {
						value = 'player';
					} else if (entity.self) {
						value = 'self';
					} else if (entity.name) {
						value = '[' + entity.name + ']';
					} else if (entity.varName) {
						value = `[Var: ${entity.varName}]`;
					} else if (entity.party) {
						value = `[Party: ${entity.party}]`;
					}
					break;
				}
				case 'EnemyType': {
					const enemyType = value as WMTypes.EnemyType;
					value = '[' + enemyType.type + ']';
					break;
				}
				case 'NumberExpression':
				case 'StringExpression':
				case 'BooleanExpression': {
					const expression = value as WMTypes.NumberExpression
						| WMTypes.StringExpression
						| WMTypes.BooleanExpression;
					value = this.getVarExpressionValue(expression);
					break;
				}
				case 'VarName': {
					const varName = value as WMTypes.VarName;
					if (typeof varName === 'object') {
						if (varName.indirect) {
							value = `[indirect: ${value.indirect}]`;
						} else if (varName.actorAttrib) {
							value = `[actorAttrib: ${value.indirect}]`;
						}
					}
					break;
				}
				case 'Effect':
				case 'Animation': {
					const obj = value as WMTypes.Effect | WMTypes.Animation;
					if (obj) {
						value = `${obj.sheet}/${obj.name}`;
					}
					break;
				}
			}
		}

		//Wrapping the key-value pair in a display-block span makes it so that long events get first split across different properties,
		//while the individual property's text only gets split when it's too long to fit in a single line
		return `<span style="display: inline-block;"><span style="color: #858585">${key}</span>: ${value}</span>`;
	}

	protected getVarExpressionValue<T>(value: WMTypes.VarExpression<T>, supportsActorAttrib = false): T | string {
		if (value && typeof value == 'object') {
			if ('indirect' in value) {
				return `[indirect: ${value.indirect}]`;
			} else if ('varName' in value) {
				return `[varName: ${value.varName}]`;
			} else if ('actorAttrib' in value && supportsActorAttrib) {
				return `[actorAttrib: ${value.actorAttrib}]`;
			}
		}
		return value as T;
	}

	protected getVec2String(x: number, y: number): string {
		return `(${this.sanitize(x)}, ${this.sanitize(y)})`;
	}

	protected getVec3String(x: number, y: number, z?: number, level?: number): string {
		if (level !== undefined) {
			return `(${this.sanitize(x)}, ${this.sanitize(y)}, lvl ${this.sanitize(level)})`;
		} else {
			return `(${this.sanitize(x)}, ${this.sanitize(y)}, ${this.sanitize(z!)})`;
		}
	}

	protected getTypeString(color: string): string {
		color = this.sanitize(color);
		return this.getBoldString(this.data.type, color);
	}

	protected getBoldString(text: string, color: string): string {
		return `<b style="color: ${this.sanitize(color)}">${text}</b>`;
	}

	protected getColoredString(text: string, color: string): string {
		return `<span style="color: ${this.sanitize(color)}">${text}</span>`;
	}

	protected getColorRectangle(color: string): string {
		return `<span style="background-color: ${this.sanitize(color)};">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
	}

	protected getProcessedText(langLabel: Label): string {
		return this.colorService.processText(langLabel?.en_US ?? '');
	}

	private sanitize(val: string | number) {
		return this.domSanitizer.sanitize(SecurityContext.HTML, val) || '';
	}
}
