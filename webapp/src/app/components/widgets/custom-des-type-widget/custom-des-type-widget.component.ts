import { Component } from '@angular/core';
import { ImageSelectOverlayComponent } from '../shared/image-select-overlay/image-select-overlay.component';
import { HttpClientService } from '../../../services/http-client.service';
import { OverlayService } from '../../dialogs/overlay/overlay.service';
import { Overlay } from '@angular/cdk/overlay';
import { Globals } from '../../../services/globals';
import { OverlayWidget } from '../overlay-widget';
import { ItemDestruct, ItemDestructAttributes, ItemDestructTypes } from '../../../services/phaser/entities/registry/item-destruct';
import { Helper } from '../../../services/phaser/helper';
import { GlobalSettings } from '../../../services/phaser/global-settings';

@Component({
	selector: 'app-custom-des-type-widget',
	templateUrl: './custom-des-type-widget.component.html',
	styleUrls: ['./custom-des-type-widget.component.scss', '../widget.scss']
})
export class CustomDesTypeWidgetComponent extends OverlayWidget<ItemDestructAttributes> {
	
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
		
		this.comp.showGlobalCheckbox = true;
		this.comp.title = 'Item Destruct Type';
		this.comp.splitBaseName = CustomDesTypeWidgetComponent.name;
		this.comp.showRightProps = false;
		
		this.comp.exit.subscribe(() => {
			this.close();
		});
		
		this.comp.leftPropChange.subscribe(prop => this.setPropType(prop));
		this.comp.globalChange.subscribe(_ => {
			this.updateProps();
			this.setPropType(this.comp.leftProp);
		});
		
		this.comp.global = !!this.settings.__GLOBAL__;
		this.setPropType(this.settings.__GLOBAL__ || this.settings.desType);
		await this.updateProps();
		
		return obj.ref;
	}
	
	private setPropType(prop?: string) {
		this.comp.leftProp = prop;
		const key = this.getKey(this.comp.global);
		if (this.settings[key] === prop) {
			return;
		}
		this.setSetting(key, prop);
		this.setSetting(this.getKey(!this.comp.global), undefined);
	}
	
	private getKey(global: boolean): keyof ItemDestructAttributes {
		return global ? '__GLOBAL__' : 'desType';
	}
	
	private async updateProps() {
		this.comp.leftProps = [];
		
		const entityClass = Globals.entityRegistry.getEntity('ItemDestruct');
		const enemyEntity = new entityClass(Globals.scene, Globals.map, -999999, 0, 'ItemDestruct') as unknown as ItemDestruct;
		
		let destructibles: { name: string, desType: string }[];
		if (this.comp.global) {
			const settings = await Helper.getJsonPromise('data/global-settings') as GlobalSettings.GlobalSettings;
			destructibles = Object.values(settings.ENTITY.ItemDestruct).map(v => ({
				name: v._globalSettingKey,
				desType: v.desType
			}));
		} else {
			const json = Globals.scene.cache.json.get('destructibles.json') as ItemDestructTypes;
			destructibles = Object.keys(json).map(v => ({
				name: v,
				desType: v
			}));
		}
		
		for (const destructible of destructibles) {
			this.comp.leftProps.push({
				name: destructible.name,
				imgSrc: await this.generateImage<ItemDestructAttributes>({desType: destructible.desType}, enemyEntity)
			});
		}
		
		enemyEntity.destroy();
	}
}
