import { Point3 } from '../../../../models/cross-code-map';
import { Helper } from '../../helper';
import {
	Anims,
	AnimSheet,
	prepareProp,
	PropDef,
	PropSheet,
} from '../../sheet-parser';
import { Fix } from '../cc-entity';
import { DefaultEntity } from './default-entity';

export interface PropType {
	sheet?: string;
	name?: string;
}

export interface PropAttributes {
	propType?: PropType;
	propAnim?: string;
	condAnims?: string;
	spawnCondition?: string;
	touchVar?: string;
	interact?: string;
	showEffect?: string;
	hideEffect?: string;
	permaEffect?: string;
	hideCondition?: string;
}

interface PropSprite {
	sheet: AnimSheet;
	tileOffset: number;
	alpha: number;
	offset?: Partial<Point3>;
	renderMode?: string;
	flipX?: boolean;
}

export class Prop extends DefaultEntity {
	protected override async setupType(settings: PropAttributes) {
		if (!settings.propType) {
			console.warn('prop without prop type');
			return this.generateErrorImage();
		}
		const sheet = (await Helper.getJsonPromise(
			'data/props/' + settings.propType.sheet,
		)) as PropSheet;
		if (!sheet) {
			console.warn('prop without sheet', settings);
			return this.generateErrorImage();
		}

		let prop: PropDef | undefined;
		for (const p of sheet.props) {
			if (settings.propType.name === p.name) {
				prop = p;
				break;
			}
		}
		if (!prop) {
			console.error('prop not found: ' + settings.propType.name);
			return this.generateErrorImage();
		}

		this.entitySettings = { sheets: { fix: [] } } as any;
		if (prop.anims) {
			await this.setupAnims(settings, prop, sheet);
		} else if (prop.fix) {
			const exists = await Helper.loadTexture(prop.fix.gfx, this.scene);
			if (!exists) {
				console.error('prop image does not exist: ' + prop.fix.gfx);
				return this.generateErrorImage();
			}

			this.entitySettings.sheets.fix[0] = prop.fix;
			this.entitySettings.sheets.renderMode = prop.fix.renderMode;
		} else {
			console.error('failed to create prop: ' + prop.name);
			return this.generateErrorImage();
		}
		this.entitySettings.baseSize = prop.size;
		this.entitySettings.collType = prop.collType;
		this.updateSettings();
	}

	private async setupAnims(
		settings: PropAttributes,
		propDef: PropDef,
		sheetDef: PropSheet,
	) {
		const sprites: PropSprite[] = [];

		const anims: Anims = prepareProp(propDef, sheetDef);

		const propAnim = settings.propAnim || 'default';

		if (propAnim === 'floor4') {
			console.log('as');
		}

		if (Array.isArray(anims.SUB)) {
			const firstName = this.setupAnim(
				propAnim,
				anims,
				propDef,
				{},
				sprites,
			);

			// no sheet found with propAnim. Just take first one
			if (sprites.length === 0 && firstName) {
				this.setupAnim(firstName, anims, propDef, {}, sprites);
			}
		} else if (anims.sheet) {
			sprites.push({
				sheet: anims.sheet as AnimSheet,
				alpha: anims.framesAlpha?.[0] ?? 1,
				tileOffset: anims.tileOffset ?? 0,
				renderMode: anims.renderMode,
				offset: anims.offset,
			});
		}

		if (sprites.length === 0) {
			console.warn('failed creating prop: ', settings);
			return this.generateErrorImage();
		}

		this.entitySettings.sheets.fix = [];
		for (const sprite of sprites) {
			if (!sprite.sheet) {
				console.error('prop sheet not found, ', propDef.name);
				return this.generateErrorImage();
			}

			await Helper.loadTexture(sprite.sheet.src, this.scene);

			const fix: Fix = {
				gfx: sprite.sheet.src,
				w: sprite.sheet.width,
				h: sprite.sheet.height,
				x:
					sprite.sheet.width * sprite.tileOffset +
					(sprite.sheet.offX || 0),
				y: sprite.sheet.offY || 0,
				alpha: sprite.alpha,
				offsetX: 0,
				offsetY: 0,
				flipX: sprite.flipX,
				renderMode: sprite.renderMode,
			};

			if (sprite.offset) {
				fix.offsetX = sprite.offset.x || 0;
				fix.offsetY = (sprite.offset.y || 0) - (sprite.offset.z || 0);
			}
			this.entitySettings.sheets.fix.push(fix);
		}
	}

	private setupAnim(
		propAnim: string,
		anims: Anims,
		propDef: PropDef,
		settings: Anims,
		sprites: PropSprite[],
	): string | undefined {
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
				const animName = this.setupAnim(
					propAnim,
					sub,
					propDef,
					settings,
					sprites,
				);
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
			console.error('anim sheet not found, skip: ', propDef);
			return firstName;
		}

		const offset: Point3 = {
			x: 0,
			y: 0,
			z: 0,
			...settings.offset,
		};

		// not sure about this one, fixes chair in propType: "booth", sheet: "trading-autumn"
		if (settings.wallY) {
			offset.y += settings.wallY * (settings.size?.z ?? 0);
		}

		if (settings.gfxOffset) {
			offset.x += settings.gfxOffset.x ?? 0;
			offset.y += settings.gfxOffset.y ?? 0;
		}

		const frame = settings.frames?.[0] ?? 0;

		if (frame > 0) {
			const xCount = sheet.xCount || 999;
			const xOffset = (frame % xCount) * sheet.width;
			const yOffset = Math.floor(frame / xCount) * sheet.height;
			sheet.offX = (sheet.offX ?? 0) + xOffset;
			sheet.offY = (sheet.offY ?? 0) + yOffset;
		}

		sprites.push({
			sheet: sheet,
			alpha: settings.framesAlpha?.[frame] ?? 1,
			offset: offset,
			tileOffset: settings.tileOffset ?? 0,
			renderMode: settings.renderMode,
			flipX: Array.isArray(settings.flipX)
				? !!settings.flipX[frame]
				: settings.flipX,
		});
		return firstName;
	}
}
