import { CCMap } from '../../tilemap/cc-map';
import { CCEntity, EntityAttributes, ScaleSettings } from '../cc-entity';
import { Globals } from '../../../globals';

export interface EntitiesJson {
	[key: string]: JsonEntityType;
}

interface JsonEntityType {
	attributes: EntityAttributes;
	
	spawnable?: boolean;
	
	drawBox?: boolean;
	borderColor?: string;
	boxColor?: string;
	circleColor?: string;
	frontColor?: string;
	
	scalableX?: boolean;
	scalableY?: boolean;
	scalableStep?: number;
	
	alwaysRecreate?: boolean;
	noZLine?: boolean;
}

interface SizeOverride {
	x?: number;
	y?: number;
}

export class DefaultEntity extends CCEntity {
	
	private static BASE_SIZE_OVERRIDES: {[entityType: string]: SizeOverride} = {
		'WallHorizontal': {
			y: 8,
		},
		'WallVertical': {
			x: 8,
		}
	};
	
	constructor(
		scene: Phaser.Scene,
		map: CCMap,
		x: number,
		y: number,
		private typeName: string
	) {
		super(scene, map, x, y, typeName);
		const entities = Globals.jsonLoader.loadJsonMergedSync<EntitiesJson>('entities.json');
		this.typeDef = entities[typeName];
	}
	
	private readonly typeDef?: JsonEntityType;
	private settings: any = {};
	private scaleSettings?: ScaleSettings;
	
	getAttributes(): EntityAttributes {
		if (this.typeDef) {
			return this.typeDef.attributes;
		}
		
		const out: EntityAttributes = {};
		Object.keys(this.settings).forEach(key => {
			out[key] = {
				type: 'Unknown',
				description: ''
			};
		});
		return out;
	}
	
	getScaleSettings(): ScaleSettings | undefined {
		if (this.scaleSettings) {
			return this.scaleSettings;
		}
		
		if (!this.typeDef) {
			return undefined;
		}
		
		const step = this.typeDef.scalableStep || 1;
		
		this.scaleSettings = {
			scalableX: !!this.typeDef.scalableX,
			scalableY: !!this.typeDef.scalableY,
			scalableStep: step,
			baseSize: {
				x: DefaultEntity.BASE_SIZE_OVERRIDES[this.typeName]?.x ?? step,
				y: DefaultEntity.BASE_SIZE_OVERRIDES[this.typeName]?.y ?? step,
			}
		};
		
		return this.scaleSettings;
	}
	
	protected async setupType(settings: any) {
		this.settings = settings;
		if (!this.typeDef) {
			this.generateNoImageType();
			return;
		}
		
		const boxColor = this.convertToColor(this.typeDef.boxColor);
		const frontColor = this.convertToColor(this.typeDef.frontColor);
		this.generateNoImageType(boxColor.rgb, boxColor.a, frontColor.rgb, frontColor.a);
		
	}
	
	private convertToColor(rgba?: string) {
		if (!rgba) {
			return {};
		}
		const numbers = rgba.replace(/[^0-9.]/g, ',').split(',').filter(v => v);
		const r = parseInt(numbers[0], 10);
		const g = parseInt(numbers[1], 10);
		const b = parseInt(numbers[2], 10);
		return {
			rgb: b + (g * 2 ** 8) + (r * 2 ** 16),
			a: parseFloat(numbers[3])
		};
	}
}
