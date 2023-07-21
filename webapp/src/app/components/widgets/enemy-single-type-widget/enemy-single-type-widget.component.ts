import { Component } from '@angular/core';
import { OverlayWidget } from '../overlay-widget';
import { ImageSelectOverlayComponent, PropListGroup } from '../shared/image-select-overlay/image-select-overlay.component';
import { HttpClientService } from '../../../services/http-client.service';
import { OverlayService } from '../../dialogs/overlay/overlay.service';
import { Overlay } from '@angular/cdk/overlay';
import { lastValueFrom } from 'rxjs';
import { Enemy, EnemyAttributes, EnemyInfo } from '../../../services/phaser/entities/registry/enemy';
import { Globals } from '../../../services/globals';

@Component({
	selector: 'app-enemy-single-type-widget',
	templateUrl: './enemy-single-type-widget.component.html',
	styleUrls: ['./enemy-single-type-widget.component.scss', '../widget.scss']
})
export class EnemySingleTypeWidgetComponent extends OverlayWidget<EnemyInfo> {
	
	private typeKey: keyof EnemyInfo = 'type';
	
	private props: {
		prefix: string;
		full: string;
		img: string;
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
		
		this.comp.title = 'Enemy Type';
		this.comp.splitBaseName = EnemySingleTypeWidgetComponent.name;
		
		this.comp.rightGroups = [this.rightGroup];
		
		this.comp.exit.subscribe(() => {
			this.close();
		});
		
		this.comp.leftGroup.click = prop => {
			const prefix = this.settings.type?.split('.')?.[0];
			if (prop === prefix) {
				return;
			}
			this.setPropType(this.props.find(v => v.prefix === prop)?.full ?? '', true);
		};
		this.rightGroup.click = prop => this.setPropType(prop);
		
		this.setPropType(this.settings.type ?? '');
		await this.updateProps();
		this.updateRightSide();
		
		return obj.ref;
	}
	
	private setPropType(prop: string, updateRightSide = false) {
		const first = prop.split('.')?.[0];
		this.comp.leftGroup.selected = first;
		this.rightGroup.selected = prop;
		if (this.settings.type === prop) {
			return;
		}
		this.setSetting(this.typeKey, prop);
		if (updateRightSide) {
			this.updateRightSide();
		}
	}
	
	private updateRightSide() {
		const prefix = this.settings.type?.split('.')?.[0];
		this.rightGroup.props = this.props.filter(v => v.prefix === prefix).map(v => ({
			name: v.full,
			displayName: v.full.split('.')?.[1],
			imgSrc: v.img
		}));
	}
	
	private async updateProps() {
		this.props = [];
		this.comp.leftGroup.props = [];
		this.rightGroup.props = [];
		
		const entityClass = Globals.entityRegistry.getEntity('Enemy');
		const enemyEntity = new entityClass(Globals.scene, Globals.map, -999999, 0, 'Enemy') as unknown as Enemy;
		
		const enemies = (await lastValueFrom(this.http.getEnemies())).map(v => v.replaceAll('/', '.'));
		
		for (const enemy of enemies) {
			const prop: typeof this.props[0] = {
				prefix: enemy.split('.')[0],
				full: enemy,
				img: await this.generateImage<EnemyAttributes>({enemyInfo: {type: enemy}}, enemyEntity)
			};
			this.props.push(prop);
			
			let el = this.comp.leftGroup.props.find(v => v.name === prop.prefix);
			if (!el) {
				el = {
					name: prop.prefix,
					imgSrc: prop.img,
					count: 0
				};
				this.comp.leftGroup.props.push(el);
			}
			el.count = (el.count ?? 0) + 1;
		}
		
		enemyEntity.destroy();
	}
}
