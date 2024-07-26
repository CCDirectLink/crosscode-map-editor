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
import { PropListCard } from '../shared/image-select-overlay/image-select-card/image-select-card.component';

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
		
		this.comp.leftGroup.click = prop => this.setPropType(prop);
		this.comp.globalChange.subscribe(_ => {
			this.updateProps();
			this.setPropType(this.comp.leftGroup.selected);
		});
		
		this.comp.global = !!this.settings.__GLOBAL__;
		this.setPropType(this.settings.__GLOBAL__ || this.settings.desType);
		await this.updateProps();
		
		return obj.ref;
	}
	
	private setPropType(prop?: string) {
		this.comp.leftGroup.selected = prop;
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
		const props: PropListCard[] = [];
		this.comp.leftGroup.props = [];
		this.comp.loading = true;
		
		let destructibles: { name: string, desType: string }[];
		if (this.comp.global) {
			const settings = await Helper.getJsonPromise('data/global-settings') as GlobalSettings.GlobalSettings;
			destructibles = Object.values(settings.ENTITY.ItemDestruct).map(v => ({
				name: v._globalSettingKey,
				desType: v.desType
			}));
		} else {
			const json = await Globals.jsonLoader.loadJsonMerged<ItemDestructTypes>('destructibles.json');
			destructibles = Object.keys(json).map(v => ({
				name: v,
				desType: v
			}));
		}
		
		await Promise.all(destructibles.map(async destructible => {
			props.push({
				name: destructible.name,
				imgSrc: await this.generateImage<ItemDestructAttributes>({desType: destructible.desType}, 'ItemDestruct')
			});
		}));
		props.sort((a, b) => a.name.localeCompare(b.name));
		
		this.comp.leftGroup.props = props;
		this.comp.loading = false;
	}
}
