import { Component } from '@angular/core';
import { OverlayWidget } from '../overlay-widget';
import { ImageSelectOverlayComponent, PropListGroup } from '../shared/image-select-overlay/image-select-overlay.component';
import { OverlayService } from '../../dialogs/overlay/overlay.service';
import { Overlay } from '@angular/cdk/overlay';
import { HttpClientService } from '../../../services/http-client.service';
import { lastValueFrom } from 'rxjs';
import { Prop, PropAttributes } from '../../../services/phaser/entities/registry/prop';
import { Helper } from '../../../services/phaser/helper';
import { Anims, prepareSheet, PropDef, PropSheet } from '../../../services/phaser/sheet-parser';
import { Globals } from '../../../services/globals';

@Component({
	selector: 'app-prop-type-widget',
	templateUrl: './prop-type-widget.component.html',
	styleUrls: ['./prop-type-widget.component.scss', '../widget.scss']
})
export class PropTypeWidgetComponent extends OverlayWidget<PropAttributes> {
	
	private sheetKey = ['propType', 'sheet'];
	private nameKey = ['propType', 'name'];
	private animKey: keyof PropAttributes = 'propAnim';
	
	private props: {
		name: string;
		propAnim: string;
		imgSrc?: string;
	}[] = [];
	
	private rightGroup: PropListGroup = {
		props: []
	};
	
	private comp: ImageSelectOverlayComponent = new ImageSelectOverlayComponent();
	
	constructor(
		private http: HttpClientService,
		overlayService: OverlayService,
		overlay: Overlay
	) {
		super(overlayService, overlay);
	}
	
	override async openInternal() {
		const obj = this.overlayService.open(ImageSelectOverlayComponent, {
			positionStrategy: this.overlay.position().global(),
			hasBackdrop: false,
			disablePhaserInput: true
		});
		
		this.comp = obj.instance;
		
		this.comp.splitBaseName = PropTypeWidgetComponent.name;
		this.comp.sheet = this.settings.propType?.sheet;
		this.comp.leftGroup.selected = this.settings.propType?.name;
		this.rightGroup.selected = this.settings.propAnim;
		
		this.comp.title = 'Prop Type';
		
		this.comp.rightGroups = [this.rightGroup];
		
		this.comp.exit.subscribe(() => {
			this.close();
		});
		
		this.comp.sheetChange.subscribe(sheet => this.setSheet(sheet));
		this.comp.leftGroup.click = prop => this.setPropType(prop);
		this.rightGroup.click = prop => this.setPropAnim(prop);
		
		this.comp.sheets = await lastValueFrom(this.http.getProps());
		await this.updateProps();
		this.updatePropAnims();
		
		return obj.ref;
	}
	
	private async setSheet(sheet: string) {
		this.comp.sheet = sheet;
		if (this.settings.propType?.sheet === sheet) {
			return;
		}
		this.setSetting(this.sheetKey, sheet);
		await this.updateProps();
		this.setPropType('');
	}
	
	private setPropType(prop: string) {
		this.comp.leftGroup.selected = prop;
		if (this.settings.propType?.name === prop) {
			return;
		}
		this.setSetting(this.nameKey, prop);
		this.updatePropAnims();
	}
	
	private setPropAnim(propAnim: string) {
		this.rightGroup.selected = propAnim;
		this.setSetting(this.animKey, propAnim);
	}
	
	private async updateProps() {
		this.props = [];
		this.comp.leftGroup.props = [];
		this.rightGroup.props = [];
		const sheetPath = this.settings.propType?.sheet ?? '';
		if (!this.comp.sheets.includes(sheetPath)) {
			return;
		}
		
		let sheet = await Helper.getJsonPromise('data/props/' + sheetPath) as PropSheet;
		sheet = prepareSheet(sheet);
		
		const entityClass = Globals.entityRegistry.getEntity('Prop');
		const propEntity = new entityClass(Globals.scene, Globals.map, -999999, 0, 'Prop') as unknown as Prop;
		
		const props = sheet.props.filter(v => v.name) as (PropDef & { name: string })[];
		props.sort((a, b) => a.name!.localeCompare(b.name!));
		this.comp.showRightProps = false;
		for (const prop of props) {
			const names = this.getSubNames(prop.anims?.SUB);
			let firstImg = '';
			
			if (names.length === 0) {
				names.push('default');
			}
			if (names.length >= 2) {
				this.comp.showRightProps = true;
			}
			for (const name of names) {
				const imgSrc = await this.generateImage({
					propType: {
						sheet: sheetPath,
						name: prop.name
					},
					propAnim: name
				}, propEntity);
				this.props.push({
					name: prop.name,
					propAnim: name,
					imgSrc: imgSrc
				});
				firstImg = firstImg || imgSrc;
			}
			this.comp.leftGroup.props.push({
				name: prop.name,
				imgSrc: firstImg,
				count: names.length
			});
		}
		
		propEntity.destroy();
	}
	
	private updatePropAnims() {
		const name = this.settings.propType?.name;
		this.rightGroup.props = this.props.filter(v => v.name === name).map(v => ({
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
