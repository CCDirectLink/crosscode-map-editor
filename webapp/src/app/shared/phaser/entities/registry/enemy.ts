import { DefaultEntity } from './default-entity';
import { Helper } from '../../helper';
import { EnemyData } from '../../../../models/enemy';
import { PathResolver, BasePath, FileExtension } from '../../../path-resolver';
import { Point3 } from '../../../../models/cross-code-map';
import { Point } from 'electron';

export class Enemy extends DefaultEntity {
	protected async setupType(settings: any) {
		settings.enemyInfo = settings.enemyInfo || {};

		const enemyPath = PathResolver.convertToPath(BasePath.ENEMIES, settings.enemyInfo.type, FileExtension.NONE);
		const enemyData = await Helper.getJsonPromise(enemyPath) as EnemyData;

		const sheetPath = PathResolver.convertToPath(BasePath.ANIMATIONS, enemyData.anims, FileExtension.NONE);
		const sheet = this.resolveSUB(await Helper.getJsonPromise(sheetPath)) as any[]; //TODO: type
		
		//TODO: proper rendering
		const first = sheet[0];
		const named = first.namedSheets[first.sheet];
		
		await Helper.loadTexture(named.src, this.scene);

		this.entitySettings.sheets = {
			fix: [{
				gfx: named.src,
				h: named.height,
				w: named.width,
				x: named.x,
				y: named.y,
				offsetX: named.offX,
				offsetY: named.offY,
			}]
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
		for(const sub of SUB) {
			for (const subSub of this.resolveSUB(sub)) {
				const combined = Object.assign(Object.assign({}, subSub), object);
				delete combined.SUB;
				result.push(combined);
			}
		}

		return result;
	}
}
