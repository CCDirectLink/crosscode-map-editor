import { DefaultEntity } from './default-entity';
import { Helper } from '../../helper';
import { EnemyData } from '../../../../models/enemy';
import { PathResolver, BasePath, FileExtension } from '../../../path-resolver';
import { MultiDirAnimation } from '../../../../models/multi-dir-animation';
import { MultiEntityAnimation } from '../../../../models/multi-entity-animation';
import { TileSheet } from '../../../../models/tile-sheet';
import { Point, Point3 } from '../../../../models/cross-code-map';
import { SingleDirAnimation } from '../../../../models/single-dir-animation';

export class Enemy extends DefaultEntity {
	protected async setupType(settings: any) {
		settings.enemyInfo = settings.enemyInfo || {};

		const enemyPath = PathResolver.convertToPath(BasePath.ENEMIES, settings.enemyInfo.type || '', FileExtension.NONE);
		const enemyData = await Helper.getJsonPromise(enemyPath) as EnemyData | undefined;
		if (!enemyData) {
			this.generateErrorImage();
			return;
		}

		const sheetPath = PathResolver.convertToPath(BasePath.ANIMATIONS, enemyData.anims, FileExtension.NONE);
		const rawSheet = await Helper.getJsonPromise(sheetPath);
		if (!rawSheet) {
			this.generateErrorImage();
			return;
		}

		const sheet = this.resolveSUB(rawSheet) as MultiDirAnimation[] | [MultiEntityAnimation];
		if (!sheet || sheet.length === 0) {
			this.generateErrorImage();
			return;
		}

		this.entitySettings.sheets = { fix: [] };

		if (this.isMultiDir(sheet)) {
			if(!await this.renderMultiDirAnim(sheet.find(s => s.name === 'idle') ?? sheet[0])) {
				this.generateErrorImage();
				return;
			}
		} else {
			if(!await this.renderMultiEntityAnim(sheet[0])) {
				this.generateErrorImage();
				return;
			}
		}

		this.entitySettings.baseSize = enemyData.size;
		this.updateSettings();
	}

	private resolveSUB(object: any): any[] {
		if (!object.SUB || !(object.SUB instanceof Array)) {
			return [object];
		}
		const SUB: any[] = object.SUB;

		const result = [];
		for (const sub of SUB) {
			for (const subSub of this.resolveSUB(sub)) {
				const combined = Object.assign(Object.assign({}, subSub), object);
				delete combined.SUB;
				result.push(combined);
			}
		}

		return result;
	}

	private isMultiDir(sheet: MultiDirAnimation[] | [MultiEntityAnimation]): sheet is MultiDirAnimation[] {
		return sheet[0].DOCTYPE === 'MULTI_DIR_ANIMATION';
	}

	private async renderMultiDirAnim(anim: MultiDirAnimation): Promise<boolean> {
		const tileSheet = typeof anim.sheet === 'string' ? anim.namedSheets[anim.sheet] : anim.sheet;

		if (!await Helper.loadTexture(tileSheet.src, this.scene)) {
			return false;
		}

		this.render(tileSheet, {x: 0, y: 0}, anim.frames[0]);

		return true;
	}

	private render(anim: TileSheet, pos: Point, frame: number): void {
		const offsetX = (anim.offX || 0) + (anim.xCount ? (frame % anim.xCount * anim.width) : 0);
		const offsetY = (anim.offY || 0) + (anim.xCount ? (Math.floor(frame / anim.xCount) * anim.height) : 0);

		this.entitySettings.sheets.fix.push({
			gfx: anim.src,
			h: anim.height,
			w: anim.width,
			x: offsetX,
			y: offsetY,
			offsetX: pos.x,  // + tileSheet.x
			offsetY: pos.y, // + tileSheet.y,
		});
	}

	private async renderMultiEntityAnim(animation: MultiEntityAnimation): Promise<boolean> {
		const partAnims: Record<string, Record<string, SingleDirAnimation[]>> = {};

		//Load
		const loading: Promise<void>[] = [];
		if (animation.namedSheets) {
			for (const sheet of Object.values(animation.namedSheets)) {
				loading.push((async (name: string) => {
					if (!await Helper.loadTexture(name, this.scene)) {
						throw new Error('Could not load texture: ' + name);
					}
				})(sheet.src));
			}
		}

		for (const [partName, part] of Object.entries(animation.parts)) {
			partAnims[partName] = {};
			const partAnim = partAnims[partName];
			const anims = this.resolveSUB(part.anims) as SingleDirAnimation[];
			
			for (const anim of anims) {
				const entry = partAnim[anim.name] = partAnim[anim.name] || [];
				entry.push(anim);
				if (typeof anim.sheet === 'object') {
					loading.push((async (name: string) => {
						if (!await Helper.loadTexture(name, this.scene)) {
							throw new Error('Could not load texture: ' + name);
						}
					})(anim.sheet.src));
				} else {
					anim.sheet = animation.namedSheets![anim.sheet];
				}
			}
		}

		const success = await Promise.all(loading)
			.then(() => true)
			.catch(() => false); 
		if (!success) {
			return false;
		}

		//Render
		const anim = animation.anims['idle'] || animation.anims['default'] || animation.anims[Object.keys(animation.anims)[0]];

		for (const [partName, partAnim] of Object.entries(anim.partAnims)) {
			const part = animation.parts[partName];

			//back left bottom corner of entity
			const offset: Point3 = {
				x: (part.size.x - animation.baseSize.x) / 2, 
				y: (part.size.y - animation.baseSize.y) / 2,
				z: 0, //(part.size.z - animation.baseSize.z) / 2,
			};

			//position of part
			offset.x += part.pos.x;
			offset.y += part.pos.y;
			offset.z += part.pos.z;

			//frame offset
			offset.x += partAnim.posFrames[0];
			offset.y += partAnim.posFrames[1];
			offset.z += partAnim.posFrames[2];

			for (const entry of partAnims[partName][partAnim.anim]) {
				//Move to top if wallY = 0
				this.renderSingleDirAnim(entry, this.toPoint(offset), part.size);
			}

			/*			
			this.drawBoundingBoxAt({
				x: offset.x - (part.size.x - animation.baseSize.x) / 2, 
				y: offset.y - (part.size.y - animation.baseSize.y) / 2, 
				z: offset.z - (part.size.z - animation.baseSize.z) / 2, 
			}, part.size);
			*/
		}

		return true;
	}

	private renderSingleDirAnim(anim: SingleDirAnimation, offset: Point, size: Point3): void {
		//TODO: anim.framesAngle

		if (anim.framesSpriteOffset) {
			offset.x += anim.framesSpriteOffset[0]; 
			offset.y += anim.framesSpriteOffset[1] - anim.framesSpriteOffset[2];
		}

		const sheet = anim.sheet as TileSheet;

		//TODO: investigate wallY - this is probably wrong
		offset.y += (1 - anim.wallY) * (size.y - sheet.height);

		const offsetX = 
			(sheet.offX || 0) 
			+ (sheet.xCount ? (anim.frames[0] % sheet.xCount * sheet.width) : 0);
		const offsetY = 
			(sheet.offY || 0) 
			+ (sheet.xCount ? (Math.floor(anim.frames[0] / sheet.xCount) * sheet.height) : 0);

		this.entitySettings.sheets.fix.push({
			gfx: sheet.src,
			h: sheet.height,
			w: sheet.width,
			x: offsetX,
			y: offsetY,
			offsetX: offset.x,  // + tileSheet.x
			offsetY: offset.y, // + tileSheet.y,

			flipX: anim.flipX,
			flipY: anim.flipY,
		});
	}

	/*
	private drawBoundingBoxAt(pos: Point3, size: Point3) {
		const collImg = this.scene.add.graphics();
		this.container.add(collImg);
		
		collImg.clear();
		
		const outline = 0;
		const outlineAlpha = 1;
		
		const middleRect = new Phaser.Geom.Rectangle(0, size.y, size.x, size.z - 1);
		Helper.drawRect(collImg, middleRect, 0xff0707, 0.5, outline, outlineAlpha);
			
		const topRect = new Phaser.Geom.Rectangle(0, 0, size.x, size.y);
		Helper.drawRect(collImg, topRect, 0xffff07, 1, outline, outlineAlpha);
			
		const bottomRect = new Phaser.Geom.Rectangle(0, size.z, size.x, size.y - 1);
		Helper.drawRect(collImg, bottomRect, 0xffff07, 0.1, outline, outlineAlpha);
		
		const pos2 = this.toPoint(pos);
		
		collImg.x = pos2.x;
		collImg.y = pos2.y;
	}*/

	private toPoint(point3: Point3): Point {
		return {
			x: point3.x,
			y: point3.y - point3.z,
		};
	}
}
