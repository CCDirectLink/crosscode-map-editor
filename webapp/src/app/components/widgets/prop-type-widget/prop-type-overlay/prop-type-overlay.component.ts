import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractWidget } from '../../abstract-widget';
import { HttpClientService } from '../../../../services/http-client.service';
import { lastValueFrom } from 'rxjs';
import { Prop, PropAttributes, PropType } from '../../../../services/phaser/entities/registry/prop';
import { Helper } from '../../../../services/phaser/helper';
import { Anims, prepareSheet, PropSheet } from '../../../../services/phaser/sheet-parser';
import { Globals } from '../../../../services/globals';

interface PropName {
	name: string;
	imgSrc?: string;
}

@Component({
	selector: 'app-prop-type-overlay',
	templateUrl: './prop-type-overlay.component.html',
	styleUrls: ['./prop-type-overlay.component.scss']
})
export class PropTypeOverlayComponent extends AbstractWidget<PropType> implements OnInit, OnChanges, OnDestroy {
	
	@Output() exit = new EventEmitter<void>();
	availableSheets: string[] = [];
	
	splitBase = 13;
	private sheetKey: keyof PropType = 'sheet';
	private nameKey: keyof PropType = 'name';
	animKey: keyof PropAttributes = 'propAnim';
	props: {
		name: string;
		propAnim: string;
		imgSrc?: string;
	}[] = [];
	
	propNames: PropName[] = [];
	propAnimNames: PropName[] = [];
	
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
	
	override ngOnChanges() {
		super.ngOnChanges();
		try {
			this.splitBase = parseFloat(localStorage.getItem(PropTypeOverlayComponent.name)!) ?? this.splitBase;
		} catch (e) {
			console.error(e);
		}
	}
	
	ngOnDestroy() {
		localStorage.setItem(PropTypeOverlayComponent.name, this.splitBase.toString());
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
		this.updateType(prop);
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
		
		let sheet = await Helper.getJsonPromise('data/props/' + sheetPath) as PropSheet;
		sheet = prepareSheet(sheet);
		
		const entityClass = Globals.entityRegistry.getEntity('Prop');
		const propEntity = new entityClass(Globals.scene, Globals.map, 0, 0, 'Prop') as unknown as Prop;
		
		for (const prop of sheet.props) {
			if (!prop.name) {
				continue;
			}
			
			const names = this.getSubNames(prop.anims?.SUB);
			let firstImg = '';
			
			if (names.length === 0) {
				names.push('');
			}
			for (const name of names) {
				let imgSrc = '';
				
				const settings: Partial<PropAttributes> = {
					propType: {
						sheet: sheetPath,
						name: prop.name
					},
					propAnim: name
				};
				await propEntity.setSettings(settings);
				const img = await propEntity.generateHtmlImage();
				imgSrc = img.src;
				this.props.push({
					name: prop.name,
					propAnim: name,
					imgSrc: imgSrc
				});
				if (!firstImg) {
					firstImg = imgSrc;
				}
			}
			this.propNames.push({
				name: prop.name,
				imgSrc: firstImg
			});
		}
		
		propEntity.destroy();
		
		this.propNames.sort((a, b) => a.name.localeCompare(b.name));
	}
	
	async updatePropAnims() {
		this.propAnimNames = this.props.filter(v => v.name === this.settings.name).map(v => ({
			name: v.propAnim,
			imgSrc: v.imgSrc
		}));
	}
	
	private getSubNames(sub: Anims | Anims['SUB']): string[] {
		if (!sub) {
			return [];
		}
		
		if (Array.isArray(sub)) {
			const uniqueNames = new Set<string>();
			for (const v of sub) {
				if (v.name) {
					uniqueNames.add(v.name);
				}
				for (const name of this.getSubNames(v.SUB)) {
					uniqueNames.add(name);
				}
			}
			return Array.from(uniqueNames);
		}
		
		return [];
	}
}
