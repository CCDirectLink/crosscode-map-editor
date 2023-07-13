import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractWidget } from '../../abstract-widget';
import { HttpClientService } from '../../../../services/http-client.service';
import { lastValueFrom } from 'rxjs';
import { Anims, PropAttributes, PropSheet, PropType, SubJsonInstance } from '../../../../services/phaser/entities/registry/prop';
import { Helper } from '../../../../services/phaser/helper';


@Component({
	selector: 'app-prop-type-overlay',
	templateUrl: './prop-type-overlay.component.html',
	styleUrls: ['./prop-type-overlay.component.scss']
})
export class PropTypeOverlayComponent extends AbstractWidget<PropType> implements OnInit {
	private static globalBase = 13;
	
	@Output() exit = new EventEmitter<void>();
	availableSheets: string[] = [];
	
	private sheetKey: keyof PropType = 'sheet';
	private nameKey: keyof PropType = 'name';
	animKey: keyof PropAttributes = 'propAnim';
	props: {
		name: string;
		propAnim: string;
	}[] = [];
	
	propNames: string[] = [];
	propAnimNames: string[] = [];
	
	get base() {
		return PropTypeOverlayComponent.globalBase;
	}
	
	set base(value: number) {
		PropTypeOverlayComponent.globalBase = value;
	}
	
	constructor(
		private http: HttpClientService
	) {
		super();
	}
	
	override async ngOnInit() {
		super.ngOnInit();
		this.availableSheets = await lastValueFrom(this.http.getProps());
		await this.updateProps();
		await this.updatePropAnims();
	}
	
	close() {
		this.exit.emit();
	}
	
	async setSheet(sheet: string) {
		if (this.settings.sheet === sheet) {
			return;
		}
		this.setSetting(this.sheetKey, sheet);
		await this.updateProps();
		await this.setPropType('');
	}
	
	async setPropType(prop: string) {
		if (this.settings.name === prop) {
			return;
		}
		this.setSetting(this.nameKey, prop);
		this.setPropAnim('');
		await this.updatePropAnims();
	}
	
	setPropAnim(propAnim: string) {
		this.entity!.details.settings[this.animKey] = propAnim;
		this.updateType(propAnim);
	}
	
	async updateProps() {
		this.props = [];
		this.propNames = [];
		this.propAnimNames = [];
		
		const sheetPath = this.settings[this.sheetKey];
		if (!this.availableSheets.includes(sheetPath)) {
			return;
		}
		
		const sheet = await Helper.getJsonPromise('data/props/' + sheetPath) as PropSheet;
		
		for (const prop of sheet.props) {
			if (!prop.name) {
				continue;
			}
			this.propNames.push(prop.name);
			
			const names = this.getSubNames(prop.anims?.SUB, sheet);
			
			if (names.length === 0) {
				names.push('');
			}
			for (const name of names) {
				this.props.push({
					name: prop.name,
					propAnim: name
				});
			}
		}
	}
	
	async updatePropAnims() {
		this.propAnimNames = this.props.filter(v => v.name === this.settings.name).map(v => v.propAnim);
	}
	
	private getSubNames(sub: Anims[] | SubJsonInstance | undefined, sheet: PropSheet): string[] {
		if (!sub) {
			return [];
		}
		
		if (Array.isArray(sub)) {
			const uniqueNames = new Set<string>();
			for (const v of sub) {
				if (v.name) {
					uniqueNames.add(v.name);
				}
				for (const name of this.getSubNames(v.SUB, sheet)) {
					uniqueNames.add(name);
				}
			}
			return Array.from(uniqueNames);
		}
		
		if (sub.jsonINSTANCE) {
			const templates = sheet.jsonTEMPLATES?.[sub.jsonINSTANCE] ?? [];
			return templates.map(v => v.name);
		}
		
		return [];
	}
}
