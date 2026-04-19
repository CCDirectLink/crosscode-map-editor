import { Helper } from '../../helper';
import { prepareProp, PropDef, PropSheet } from '../../sheet-parser';
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
		
		let prop: PropDef | undefined;
		for (let i = 0; i < sheet.props.length; i++) {
			const p = sheet.props[i];
			if (settings.propType.name === p.name) {
				prop = p;
				break;
			}
		}
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
