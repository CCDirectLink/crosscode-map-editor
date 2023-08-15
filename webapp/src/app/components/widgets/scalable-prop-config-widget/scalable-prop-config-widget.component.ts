import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageSelectOverlayComponent, PropListGroup } from '../shared/image-select-overlay/image-select-overlay.component';
import { HttpClientService } from '../../../services/http-client.service';
import { OverlayService } from '../../dialogs/overlay/overlay.service';
import { Overlay } from '@angular/cdk/overlay';
import { lastValueFrom } from 'rxjs';
import { Helper } from '../../../services/phaser/helper';
import { prepareSheet, ScalablePropSheet } from '../../../services/phaser/sheet-parser';
import { Globals } from '../../../services/globals';
import { OverlayWidget } from '../overlay-widget';
import { EntryGfxEnds, GfxEndsDir, ScalableProp, ScalablePropAttributes, ScalablePropConfig, ScalablePropDef } from '../../../services/phaser/entities/registry/scalable-prop';
import { PropListCard } from '../shared/image-select-overlay/image-select-card/image-select-card.component';
import Point = Electron.Point;

@Component({
	selector: 'app-scalable-prop-config-widget',
	templateUrl: './scalable-prop-config-widget.component.html',
	styleUrls: ['./scalable-prop-config-widget.component.scss', '../widget.scss']
})
export class ScalablePropConfigWidgetComponent extends OverlayWidget<ScalablePropAttributes> implements OnInit, OnDestroy {
	private sheetKey = ['propConfig', 'sheet'];
	private nameKey = ['propConfig', 'name'];
	
	private comp: ImageSelectOverlayComponent = new ImageSelectOverlayComponent();
	private sheet?: ScalablePropSheet;
	
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
		
		this.comp.splitBaseName = ScalablePropConfigWidgetComponent.name;
		this.comp.sheet = this.settings.propConfig?.sheet;
		this.comp.title = 'Prop Config';
		this.comp.leftGroup.selected = this.settings.propConfig?.name;
		this.comp.showPreview = true;
		
		
		this.comp.exit.subscribe(() => {
			this.close();
		});
		
		this.comp.sheetChange.subscribe(sheet => this.setSheet(sheet));
		this.comp.leftGroup.click = prop => this.setPropName(prop);
		
		this.comp.sheets = await lastValueFrom(this.http.getScalableProps());
		await this.updateProps();
		await this.updateRightGroups();
		await this.updatePreview();
		
		return obj.ref;
	}
	
	private async setSheet(sheet: string) {
		this.comp.sheet = sheet;
		if (this.settings.propConfig?.sheet === sheet) {
			return;
		}
		this.setSetting(this.sheetKey, sheet);
		await this.updateProps();
		await this.setPropName('');
	}
	
	private async setPropName(prop: string) {
		this.comp.leftGroup.selected = prop;
		if (this.settings.propConfig?.name === prop) {
			return;
		}
		this.setSetting(this.nameKey, prop);
		await this.updateRightGroups();
		await this.updatePreview();
	}
	
	private async updateProps() {
		this.comp.leftGroup.props = [];
		const sheetPath = this.settings.propConfig?.sheet ?? '';
		if (!this.comp.sheets.includes(sheetPath)) {
			return;
		}
		
		let sheet = await Helper.getJsonPromise('data/scale-props/' + sheetPath) as ScalablePropSheet;
		if (!sheet) {
			console.error(`sheet doesnt exist: ${sheetPath}`);
			return;
		}
		this.comp.loading = true;
		
		sheet = prepareSheet(sheet);
		this.sheet = sheet;
		
		
		const entries: (ScalablePropDef & { name: string })[] = [];
		for (const [key, val] of Object.entries(sheet.entries)) {
			entries.push({
				...val,
				name: key
			});
		}
		
		this.comp.leftGroup.props = await Promise.all(entries.map(async prop => {
			return {
				name: prop.name,
				imgSrc: await this.generateImg(prop, prop.name)
			};
		}));
		this.comp.leftGroup.props.sort((a, b) => a.name.localeCompare(b.name));
		this.comp.loading = false;
	}
	
	private async updateRightGroups() {
		this.comp.rightGroups = [];
		const name = this.settings.propConfig?.name ?? '';
		const def = this.sheet?.entries?.[name];
		if (!def) {
			return;
		}
		
		for (const [k, v] of Object.entries(def.gfxEnds ?? {})) {
			const key = k as keyof EntryGfxEnds;
			const value = {
				'': {},
				...v,
			} as GfxEndsDir;
			
			const props: PropListCard[] = [];
			for (const patternName of Object.keys(value)) {
				props.push({
					name: patternName,
					imgSrc: await this.generateImg(def, name, {[key]: patternName})
				});
			}
			
			const group: PropListGroup = {
				title: key,
				selected: this.settings.propConfig?.ends?.[key],
				props: props,
				click: async val => {
					this.setSetting(['propConfig', 'ends', key], val);
					group.selected = val;
					await this.updatePreview();
				}
			};
			this.comp.rightGroups.push(group);
		}
	}
	
	private async updatePreview() {
		this.comp.preview = undefined;
		const propConfig = this.settings.propConfig;
		const def = this.sheet?.entries?.[propConfig?.name ?? ''];
		if (!propConfig || !def) {
			return;
		}
		const size = {
			x: 16,
			y: 16,
			...def.baseSize
		};
		
		let hasEnds = false;
		for (const [k, v] of Object.entries(propConfig.ends ?? {})) {
			const key = k as keyof EntryGfxEnds;
			const patterns = def.gfxEnds?.[key]?.[v];
			if (!patterns) {
				continue;
			}
			hasEnds = true;
			switch (key) {
				case 'west':
				case 'east':
					size.x += patterns.w;
					break;
				case 'north':
				case 'south':
					size.y += patterns.h;
					break;
			}
		}
		
		if (!hasEnds) {
			if (def.scalableX) {
				size.x += (def.scalableStep ?? 0);
			}
			if (def.scalableY) {
				size.y += (def.scalableStep ?? 0);
			}
		}
		
		this.comp.preview = await this.generateImg(def, propConfig.name, propConfig.ends, true, size);
	}
	
	private async generateImg(def: ScalablePropDef, name?: string, ends?: ScalablePropConfig['ends'], renderAll = false, size?: Point): Promise<string> {
		
		const entityClass = Globals.entityRegistry.getEntity('ScalableProp');
		const entity = new entityClass(Globals.scene, Globals.map, -999999, 0, 'ScalableProp') as unknown as ScalableProp;
		const settings: Partial<ScalablePropAttributes & { size: Point }> = {
			propConfig: {
				sheet: this.settings.propConfig?.sheet,
				name: name,
				ends: ends
			},
			size: {
				x: size?.x ?? def.baseSize?.x ?? 16,
				y: size?.y ?? def.baseSize?.y ?? 16,
			}
		};
		entity.onlyEnds = !renderAll && !!ends;
		let offsetY = 0;
		if (def.scalableY && renderAll) {
			offsetY = -32;
		}
		return this.generateImage(settings, entity, offsetY);
	}
}
