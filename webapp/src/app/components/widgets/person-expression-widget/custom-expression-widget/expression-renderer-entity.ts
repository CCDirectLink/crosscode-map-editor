import { DefaultEntity } from '../../../../services/phaser/entities/registry/default-entity';
import { Face } from '../../../../services/phaser/entities/registry/npc';
import { Helper } from '../../../../services/phaser/helper';
import { Fix } from '../../../../services/phaser/entities/cc-entity';

export interface ExpressionRendererSettings {
	face?: Face;
	expression: string;
}

export class ExpressionRendererEntity extends DefaultEntity {
	
	protected override async setupType(settings: ExpressionRendererSettings): Promise<void> {
		if (!settings?.face) {
			return;
		}
		const face = settings.face;
		const expr = settings.face.expressions?.[settings.expression];
		if (!expr) {
			return;
		}
		const sheets: Fix[] = [];
		const anim = expr.faces[0] ?? [];
		let renderHeight = 0;
		let subX = 0;
		let subY = 0;
		for (let i = 0; i < anim.length; i++) {
			const partName = anim[i];
			const part = face.parts?.[i]?.[partName];
			if (typeof part === 'number') {
				console.error('why is this a number?!');
				return;
			}
			if (!part) {
				console.error('part not found ' + partName);
				return;
			}
			const img = face.subImages?.[part.img!] || part.img || face.src;
			const sheet: Fix = {
				gfx: img,
				x: part.srcX,
				y: part.srcY,
				w: part.width,
				h: part.height,
				offsetX: part.destX + subX + part.width / 2 - (face.centerX ?? 0),
				offsetY: part.destY + subY + part.height,
			};
			
			if (sheet.offsetY! > renderHeight) {
				renderHeight = sheet.offsetY!;
			}
			
			sheets.push(sheet);
			subX += part.subX ?? 0;
			subY += part.subY ?? 0;
		}
		for (const sheet of sheets) {
			sheet.gfx = 'media/face/' + sheet.gfx;
			sheet.offsetY! -= renderHeight;
			await Helper.loadTexture(sheet.gfx, this.scene);
		}
		
		this.entitySettings = {
			sheets: {
				fix: sheets
			},
			baseSize: {
				x: 0,
				y: 0,
			},
		};
		this.updateSettings();
	}
}
