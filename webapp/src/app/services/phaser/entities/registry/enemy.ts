import { Point3 } from '../../../../models/cross-code-map';
import { EnemyData } from '../../../../models/enemy';
import { BasePath, FileExtension, PathResolver } from '../../../path-resolver';
import { Globals } from '../../../globals';
import { Fix } from '../cc-entity';
import { Helper } from '../../helper';
import { Anims, AnimSheet, Effect, flattenSUBs } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

interface MultiEntityAnim extends Anims {
	anims: Record<string, EntityAnim>;
	baseSize: Point3;
	parts: Record<string, EntityPart>;
}

interface EntityAnim {
	partAnims: Record<string, PartAnim>;
}

interface PartAnim {
	anim: string;
	posFrames?: [number, number, number];
}

interface EntityPart {
	anims: Anims;
	pos: Point3;
	size: Point3;
}

// Unit face vectors (screen coords: +y points down, so NORTH is -y). Mirrors CC's FACE8.
const FACE_VECTORS: Record<string, { x: number; y: number }> = {
	NORTH: { x: 0, y: -1 },
	NORTH_EAST: { x: 1, y: -1 },
	EAST: { x: 1, y: 0 },
	SOUTH_EAST: { x: 1, y: 1 },
	SOUTH: { x: 0, y: 1 },
	SOUTH_WEST: { x: -1, y: 1 },
	WEST: { x: -1, y: 0 },
	NORTH_WEST: { x: -1, y: -1 },
};

// Port of ig.getDirectionIndex — picks a tileOffsets slot from a face vector + dir count.
function getDirectionIndex(faceX: number, faceY: number, numDirs: number): number {
	switch (numDirs) {
		case 1:
			return 0;
		case 2:
			return faceX >= 0 ? 0 : 1;
		case 4:
			return Math.abs(faceY) > Math.abs(faceX)
				? (faceY < 0 ? 0 : 2)
				: (faceX > 0 ? 1 : 3);
		case 6:
			return faceX >= 0
				? (faceY <= 0
					? 0 + (57 * faceX > -100 * faceY ? 1 : 0)
					: 1 + (57 * faceX < 100 * faceY ? 1 : 0))
				: (faceY <= 0
					? 4 + (-57 * faceX < -100 * faceY ? 1 : 0)
					: 3 + (-57 * faceX > 100 * faceY ? 1 : 0));
		case 8:
			return Math.abs(faceY) > 2.414 * Math.abs(faceX)
				? (faceY < 0 ? 0 : 4)
				: Math.abs(faceX) > 2.414 * Math.abs(faceY)
					? (faceX > 0 ? 2 : 6)
					: (faceX > 0 ? (faceY < 0 ? 1 : 3) : (faceY > 0 ? 5 : 7));
		default:
			return Math.floor(numDirs / 2);
	}
}

export interface EnemyAttributes {
	enemyInfo?: EnemyInfo;
	spawnCondition?: string;
	manualKill?: string;
}

export interface EnemyInfo {
	group?: string;
	party?: string;
	state?: string;
	targetOnSpawn?: boolean;
	type?: string;
	attribs?: Attribs;
	startEffect?: Effect;
	face?: string;
	level?: LevelClass | number;
	disableNoScale?: boolean;
	varIncrease?: string;
	dropHealOrb?: number;
	newGameAdjust?: boolean;
	hideEffect?: Effect;
}

export interface Attribs {
	[key: string]: any;
}

export interface LevelClass {
	varName: string;
}

export class Enemy extends DefaultEntity {
	protected override async setupType(settings: EnemyAttributes) {
		settings.enemyInfo = settings.enemyInfo || {};

		const enemyPath = PathResolver.convertToPath(BasePath.ENEMIES, settings.enemyInfo.type || '', FileExtension.NONE);
		const enemyData = await Helper.getJsonPromise(enemyPath) as EnemyData | undefined;
		if (!enemyData) {
			this.generateErrorImage();
			return;
		}

		const sheetPath = PathResolver.convertToPath(BasePath.ANIMATIONS, enemyData.anims, FileExtension.NONE);
		const rawSheet = await Helper.getJsonPromise(sheetPath) as Anims | undefined;
		if (!rawSheet) {
			this.generateErrorImage();
			return;
		}

		if (rawSheet.DOCTYPE === 'MULTI_ENTITY_ANIMATION') {
			const mea = rawSheet as MultiEntityAnim;
			// Preload each part's anim tree (shares flattenSUBs-based walk via DefaultEntity).
			// Namespaced sheet refs on part leaves resolve against the root namedSheets.
			for (const part of Object.values(mea.parts)) {
				const scoped: Anims = { ...part.anims, namedSheets: mea.namedSheets };
				if (!await this.preloadAnimSheets(scoped)) {
					this.generateErrorImage();
					return;
				}
			}
			if (!this.renderMultiEntity(mea, enemyData.size)) {
				this.generateErrorImage();
			}
			return;
		}

		if (!await this.preloadAnimSheets(rawSheet)) {
			this.generateErrorImage();
			return;
		}

		await this.applyAnims({
			anims: rawSheet,
			animName: 'idle',
			label: settings.enemyInfo.type,
			baseSize: enemyData.size,
			dirIndex: this.resolveDirIndex(rawSheet, settings.enemyInfo.face),
		});
	}

	private resolveDirIndex(anims: Anims, face: string | undefined): number | undefined {
		// Find the numDirs used by this anim tree: first tileOffsets array encountered.
		let numDirs = 0;
		for (const leaf of flattenSUBs(anims, {})) {
			if (Array.isArray(leaf.tileOffsets) && leaf.tileOffsets.length > 0) {
				numDirs = leaf.tileOffsets.length;
				break;
			}
		}
		if (!numDirs) {
			return undefined;
		}
		const vec = face ? FACE_VECTORS[face] : undefined;
		if (!vec) {
			return undefined;
		}
		return getDirectionIndex(vec.x, vec.y, numDirs);
	}

	private renderMultiEntity(animation: MultiEntityAnim, baseSize: Point3): boolean {
		const anim = animation.anims['idle']
			?? animation.anims['default']
			?? animation.anims[Object.keys(animation.anims)[0]];
		if (!anim) {
			return false;
		}

		// Flatten each part's SUB tree once and resolve string sheet refs against namedSheets.
		const partAnims: Record<string, Record<string, Anims[]>> = {};
		for (const [partName, part] of Object.entries(animation.parts)) {
			partAnims[partName] = {};
			for (const leaf of flattenSUBs(part.anims, {})) {
				if (typeof leaf.sheet === 'string') {
					leaf.sheet = animation.namedSheets?.[leaf.sheet];
				}
				if (!leaf.name) {
					continue;
				}
				(partAnims[partName][leaf.name] ??= []).push(leaf);
			}
		}

		this.entitySettings = { sheets: { fix: [] } } as any;
		this.entitySettings.baseSize = baseSize;

		for (const [partName, partAnim] of Object.entries(anim.partAnims)) {
			const part = animation.parts[partName];
			if (!part) {
				continue;
			}

			// Back-left-bottom corner of the part relative to the entity's baseSize.
			const offset: Point3 = {
				x: (part.size.x - animation.baseSize.x) / 2 + part.pos.x + (partAnim.posFrames?.[0] ?? 0),
				y: (part.size.y - animation.baseSize.y) / 2 + part.pos.y + (partAnim.posFrames?.[1] ?? 0),
				z: part.pos.z + (partAnim.posFrames?.[2] ?? 0),
			};

			for (const leaf of partAnims[partName]?.[partAnim.anim] ?? []) {
				this.pushSingleDirFix(leaf, offset, part.size);
			}
		}

		this.updateSettings();
		return true;
	}

	/**
	 * Enemy anim JSONs (unlike entities.json / type-json anims) often omit xCount on their sheets,
	 * so we preload every referenced sheet and fill xCount from the image width before applyAnims
	 * runs setupAnimRecursive, which needs xCount to compute frame offsets synchronously.
	 */
	private async preloadAnimSheets(anims: Anims): Promise<boolean> {
		const sheets = new Set<AnimSheet>();
		for (const leaf of flattenSUBs(anims, {})) {
			const sheet = typeof leaf.sheet === 'string' ? leaf.namedSheets?.[leaf.sheet] : leaf.sheet;
			if (sheet) {
				sheets.add(sheet);
			}
		}
		for (const sheet of sheets) {
			if (!sheet.src) {
				continue;
			}
			if (!await Helper.loadTexture(sheet.src, this.scene)) {
				return false;
			}
			if (!sheet.xCount) {
				const img = Globals.scene.textures.get(sheet.src.trim()).getSourceImage();
				sheet.xCount = Math.max(1, Math.floor(img.width / sheet.width));
			}
		}
		return true;
	}

	private pushSingleDirFix(anim: Anims, partOffset: Point3, partSize: Point3): void {
		const sheet = anim.sheet as AnimSheet | undefined;
		if (!sheet || typeof sheet !== 'object' || !sheet.src) {
			return;
		}

		const off = { x: partOffset.x, y: partOffset.y - partOffset.z };
		if (anim.framesSpriteOffset) {
			off.x += anim.framesSpriteOffset[0] ?? 0;
			off.y += (anim.framesSpriteOffset[1] ?? 0) - (anim.framesSpriteOffset[2] ?? 0);
		}

		off.y += (1 - (anim.wallY ?? 0)) * (partSize.y - sheet.height);

		const frame = anim.frames?.[0] ?? 0;
		const xCount = sheet.xCount || 1;
		const fix: Fix = {
			gfx: sheet.src.trim(),
			w: sheet.width,
			h: sheet.height,
			x: (sheet.offX ?? 0) + (frame % xCount) * sheet.width,
			y: (sheet.offY ?? 0) + Math.floor(frame / xCount) * sheet.height,
			offsetX: off.x,
			offsetY: off.y,
			flipX: Array.isArray(anim.flipX) ? !!anim.flipX[0] : anim.flipX,
			flipY: anim.flipY,
		};
		this.entitySettings.sheets.fix.push(fix);
	}

}
