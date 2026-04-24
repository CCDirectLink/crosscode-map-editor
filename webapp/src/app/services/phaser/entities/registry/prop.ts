import { Helper } from '../../helper';
import { prepareProp, PropDef, PropSheet } from '../../sheet-parser';
import { DefaultEntity } from './default-entity';

function findProp(sheet: PropSheet, name: string): PropDef | undefined {
	for (const p of sheet.props) {
		if (p.name === name) {
			return p;
		}
		if (p.sequence) {
			const seq = p.sequence;
			for (let j = 0; j < seq.entries.length; j++) {
				const entry = seq.entries[j];
				if (entry.name !== name) {
					continue;
				}
				// CrossCode flattens sequence entries into synthetic fix-style props:
				// parent fields + per-entry overrides + fix sub-rect stepped by index.
				const merged: PropDef = { ...p, ...entry, name: entry.name };
				delete (merged as any).sequence;
				merged.fix = {
					gfx: seq.sheet.gfx,
					x: seq.sheet.x + seq.sheet.w * j,
					y: seq.sheet.y,
					w: seq.sheet.w,
					h: seq.sheet.h,
					flipX: false,
				};
				return merged;
			}
		}
	}
	return undefined;
}

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

export class Prop extends DefaultEntity {
	
	protected override async setupType(settings: PropAttributes) {
		if (!settings.propType) {
			console.warn('prop without prop type');
			return this.generateErrorImage();
		}
		const sheet = await Helper.getJsonPromise('data/props/' + settings.propType.sheet) as PropSheet;
		if (!sheet) {
			console.warn('prop without sheet', settings);
			return this.generateErrorImage();
		}
		
		const prop = findProp(sheet, settings.propType.name ?? '');
		if (!prop) {
			console.error('prop not found: ' + settings.propType.name);
			return this.generateErrorImage();
		}
		
		if (prop.anims) {
			const anims = prepareProp(prop, sheet);
			const ok = await this.applyAnims({
				anims,
				animName: settings.propAnim,
				label: prop.name,
				applyWallY: true,
			});
			if (!ok) {
				return;
			}
		} else if (prop.fix) {
			// TODO: "offY" currently only fixed in Prop. 
			//  Find out if this causes issues somewhere else and move the fix to a better place
			const fix = Helper.copy(prop.fix);
			fix.offsetY = (fix.offsetY ?? 0) + (fix.offY ?? 0);
			delete fix.offY;
			const ok = await this.pushFix(fix, true);
			if (!ok) {
				return this.generateErrorImage();
			}
			this.entitySettings.sheets.renderMode = prop.fix.renderMode;
		} else {
			console.error('failed to create prop: ' + prop.name);
			return this.generateErrorImage();
		}
		this.entitySettings.baseSize = prop.size;
		this.entitySettings.collType = prop.collType;
		this.updateSettings();
	}
}
