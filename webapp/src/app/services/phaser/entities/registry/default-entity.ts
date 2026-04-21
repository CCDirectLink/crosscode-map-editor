import { CCMap } from '../../tilemap/cc-map';
import { CCEntity, EntityAttributes, Fix, ScaleSettings } from '../cc-entity';
import { Globals } from '../../../globals';
import { Point, Point3 } from '../../../../models/cross-code-map';
import { Anims, AnimSheet, ShadowSpec } from '../../sheet-parser';
import { Helper } from '../../helper';

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
	
	anims?: Anims;
	size?: Point3;
}

interface ApplyAnimsOpts {
	anims: Anims;
	animName?: string;
	label?: string;
	mapStyle?: string;
	baseSize?: Point3;
}

interface PropSprite {
	sheet: AnimSheet;
	tileOffset: number;
	alpha: number;
	offset?: Partial<Point3>;
	renderMode?: string;
	flipX?: boolean;
	flipY?: boolean;
	aboveZ?: number;
}

export class DefaultEntity extends CCEntity {
	
	private static readonly SHADOW_SHEET = 'media/entity/shadow.png';
	
	
	constructor(
		scene: Phaser.Scene,
		map: CCMap,
		x: number,
		y: number,
		private typeName: string,
	) {
		super(scene, map, x, y, typeName);
		const entities = Globals.jsonLoader.loadJsonMergedSync<EntitiesJson>('entities.json');
		this.typeDef = entities[typeName];
	}
	
	protected readonly typeDef?: JsonEntityType;
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
				description: '',
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
		
		const step = this.typeDef.scalableStep;
		const typeSize = this.typeDef.size;
		
		this.scaleSettings = {
			scalableX: !!this.typeDef.scalableX,
			scalableY: !!this.typeDef.scalableY,
			scalableStep: step || 1,
			baseSize: {
				x: typeSize?.x ?? step ?? 16,
				y: typeSize?.y ?? step ?? 16,
			},
		};
		
		return this.scaleSettings;
	}
	
	protected async setupType(settings: any) {
		this.settings = settings;
		if (!this.typeDef) {
			this.generateNoImageType();
			return;
		}
		
		if (this.typeDef.anims) {
			await this.applyAnims({
				anims: this.typeDef.anims,
				label: this.typeName,
				baseSize: { x: 16, y: 16, z: 0, ...this.typeDef.size },
			});
			return;
		}
		
		const boxColor = this.convertToColor(this.typeDef.boxColor);
		const frontColor = this.convertToColor(this.typeDef.frontColor);
		this.generateNoImageType(boxColor.rgb, boxColor.a, frontColor.rgb, frontColor.a);
		
	}
	
	protected snapSizeToScale(scaleSettings: ScaleSettings) {
		let size = this.details.settings['size'] as Point | undefined;
		if (!size) {
			size = { x: 16, y: 16 };
			this.details.settings['size'] = size;
		}
		const step = scaleSettings.scalableStep;
		if (scaleSettings.scalableX) {
			size.x = Math.max(step, Math.round(size.x / step) * step);
		} else {
			size.x = scaleSettings.baseSize.x;
		}
		if (scaleSettings.scalableY) {
			size.y = Math.max(step, Math.round(size.y / step) * step);
		} else {
			size.y = scaleSettings.baseSize.y;
		}
	}
	
	protected resolveSheet(sheet: AnimSheet): AnimSheet {
		if (!sheet.mapStyle) {
			return sheet;
		}
		const style = Helper.getMapStyle(Globals.map, sheet.mapStyle);
		return {
			...sheet,
			src: style?.sheet ?? '',
			offX: (sheet.offX ?? 0) + (style?.x ?? 0),
			offY: (sheet.offY ?? 0) + (style?.y ?? 0),
		};
	}
	
	protected async applyAnims(opts: ApplyAnimsOpts): Promise<boolean> {
		const ok = await this.buildAnims(opts);
		if (!ok) {
			this.generateErrorImage();
		}
		return ok;
	}
	
	private async buildAnims(opts: ApplyAnimsOpts): Promise<boolean> {
		const { anims, animName, label, mapStyle, baseSize } = opts;
		const sprites: PropSprite[] = [];
		const resolvedAnim = animName || 'default';
		
		if (Array.isArray(anims.SUB)) {
			const firstName = this.setupAnimRecursive(resolvedAnim, anims, label, {}, sprites);
			if (sprites.length === 0 && firstName) {
				this.setupAnimRecursive(firstName, anims, label, {}, sprites);
			}
		} else if (anims.sheet) {
			sprites.push({
				sheet: this.resolveSheet(anims.sheet as AnimSheet),
				alpha: anims.framesAlpha?.[0] ?? 1,
				tileOffset: anims.tileOffset ?? 0,
				renderMode: anims.renderMode,
				offset: anims.offset,
				aboveZ: anims.aboveZ,
			});
		}
		
		if (sprites.length === 0) {
			console.warn('failed creating entity from anims:', label);
			return false;
		}
		
		// sort so sprites with higher aboveZ render on top of lower ones
		sprites.sort((a, b) => (a.aboveZ ?? 0) - (b.aboveZ ?? 0));
		
		for (let i = 0; i < sprites.length; i++) {
			const sprite = sprites[i];
			if (!sprite.sheet) {
				console.error('anim sheet not found, ', label);
				return false;
			}
			
			const fix: Fix = {
				gfx: sprite.sheet.src,
				w: sprite.sheet.width,
				h: sprite.sheet.height,
				x: sprite.sheet.width * sprite.tileOffset + (sprite.sheet.offX || 0),
				y: sprite.sheet.offY || 0,
				alpha: sprite.alpha,
				offsetX: 0,
				offsetY: 0,
				flipX: sprite.flipX,
				flipY: sprite.flipY,
				renderMode: sprite.renderMode,
				aboveZ: sprite.aboveZ,
			};
			
			if (sprite.offset) {
				fix.offsetX = sprite.offset.x || 0;
				fix.offsetY = (sprite.offset.y || 0) - (sprite.offset.z || 0);
			}
			
			if (!fix.gfx && mapStyle) {
				fix.gfx = Helper.getMapStyle(Globals.map, mapStyle)?.sheet ?? '';
			}
			if (!await this.pushFix(fix, i === 0)) {
				return false;
			}
		}
		
		if (baseSize) {
			this.entitySettings.baseSize = baseSize;
			if (anims.shadow && anims.shadow.size > 0) {
				await this.pushShadowFix(anims.shadow, baseSize);
			}
		}
		this.updateSettings();
		
		return true;
	}
	
	private async pushShadowFix(spec: ShadowSpec, baseSize: Point3) {
		await Helper.loadTexture(DefaultEntity.SHADOW_SHEET, this.scene);

		const tile = Helper.clamp(8 - Math.floor(spec.size / 4), 0, 7);
		const shadowAboveZ = spec.aboveZ ?? 0;
		// default fix render places img at boundBoxOffset.y - h; compensate to center at baseSize.y/2
		const fix: Fix = {
			gfx: DefaultEntity.SHADOW_SHEET,
			w: 32,
			h: 32,
			x: tile * 32,
			y: 0,
			offsetX: spec.offset?.x ?? 0,
			offsetY: (spec.offset?.y ?? 0) + 16 - baseSize.y / 2,
			alpha: 0.5,
			scaleY: spec.scaleY ?? 1,
			aboveZ: shadowAboveZ,
		};
		const fixes = this.entitySettings.sheets.fix;
		let insertIdx = 0;
		while (insertIdx < fixes.length && Number(fixes[insertIdx].aboveZ ?? 0) < shadowAboveZ) {
			insertIdx++;
		}
		fixes.splice(insertIdx, 0, fix);
	}
	
	protected setupAnimRecursive(propAnim: string, anims: Anims, label: string | undefined, settings: Anims, sprites: PropSprite[]): string | undefined {
		let firstName = anims.name;
		if (anims.name && anims.name !== propAnim) {
			return firstName;
		}
		settings = {
			...settings,
			...anims,
		};
		if (Array.isArray(anims.SUB)) {
			for (const sub of anims.SUB) {
				const animName = this.setupAnimRecursive(propAnim, sub, label, settings, sprites);
				if (!firstName) {
					firstName = animName;
				}
			}
			return firstName;
		}
		let sheet: AnimSheet | undefined;
		if (typeof settings.sheet === 'string') {
			sheet = settings.namedSheets?.[settings.sheet];
		} else {
			sheet = settings.sheet;
		}
		if (!sheet) {
			console.error('anim sheet not found, skip: ', label);
			return firstName;
		}
		sheet = this.resolveSheet(sheet);
		
		const offset: Point3 = {
			x: 0,
			y: 0,
			z: 0,
			...settings.offset,
		};
		
		if (settings.wallY) {
			offset.y += settings.wallY * (settings.size?.z ?? 0);
		}
		
		if (settings.gfxOffset) {
			offset.x += settings.gfxOffset.x ?? 0;
			offset.y += settings.gfxOffset.y ?? 0;
		}
		
		if (settings.framesSpriteOffset) {
			offset.x += settings.framesSpriteOffset[0] ?? 0;
			offset.y += settings.framesSpriteOffset[1] ?? 0;
			offset.z += settings.framesSpriteOffset[2] ?? 0;
		}
		
		const frame = settings.frames?.[0] ?? 0;
		const tileOffset = settings.tileOffset ?? 0;
		const effectiveFrame = frame + tileOffset;
		
		if (effectiveFrame > 0) {
			const xCount = sheet.xCount || 999;
			const xOffset = (effectiveFrame % xCount) * sheet.width;
			const yOffset = Math.floor(effectiveFrame / xCount) * sheet.height;
			sheet = {
				...sheet,
				offX: (sheet.offX ?? 0) + xOffset,
				offY: (sheet.offY ?? 0) + yOffset,
			};
		}
		
		sprites.push({
			sheet: sheet,
			alpha: settings.framesAlpha?.[frame] ?? 1,
			offset: offset,
			tileOffset: 0,
			renderMode: settings.renderMode,
			flipX: Array.isArray(settings.flipX) ? !!settings.flipX[frame] : settings.flipX,
			flipY: settings.flipY,
			aboveZ: settings.aboveZ,
		});
		return firstName;
	}
	
	protected async pushFix(fix: Fix, reset = false): Promise<boolean> {
		const exists = await Helper.loadTexture(fix.gfx, this.scene);
		if (!exists) {
			console.error('texture does not exist: ' + fix.gfx);
			return false;
		}
		const scale = this.getScaleSettings();
		if (fix.scalable === undefined && (fix.renderHeight || (scale && (scale.scalableX || scale.scalableY)))) {
			fix.scalable = true;
		}
		if (reset || !this.entitySettings) {
			this.entitySettings = { sheets: { fix: [] } } as any;
		}
		if (fix.scalable) {
			this.entitySettings.scalableX = scale?.scalableX;
			this.entitySettings.scalableY = scale?.scalableY;
		}
		this.entitySettings.baseSize ??= { x: 16, y: 16, z: 0, ...this.typeDef?.size };
		this.entitySettings.sheets ??= { fix: [] };
		this.entitySettings.sheets.fix ??= [];
		this.entitySettings.sheets.fix.push(fix);
		return true;
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
			a: parseFloat(numbers[3]),
		};
	}
}
