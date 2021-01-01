import { DefaultEntity } from './default-entity';
import { Helper } from '../../helper';
import { EnemyData } from '../../../../models/enemy';
import { PathResolver, BasePath, FileExtension } from '../../../path-resolver';
import { MultiDirAnimation } from '../../../../models/multi-dir-animation';
import { MultiEntityAnimation } from '../../../../models/multi-entity-animation';

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

		if (this.isMultiDir(sheet)) {
			if(!await this.renderMultiDirAnim(sheet.find(s => s.name === 'idle') ?? sheet[0])) {
				this.generateErrorImage();
				return;
			}
		} else {
			this.generateErrorImage(); //TODO multi entity
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

		this.entitySettings.sheets = {
			fix: [{
				gfx: tileSheet.src,
				h: tileSheet.height,
				w: tileSheet.width,
				x: 0, // tileSheet.x,
				y: 0, // tileSheet.y,
				offsetX: tileSheet.offX,
				offsetY: tileSheet.offY,
			}]
		};

		return true;
	}
}
