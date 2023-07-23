import { Component } from '@angular/core';
import { OverlayWidget } from '../overlay-widget';
import { ImageSelectOverlayComponent, PropListGroup } from '../shared/image-select-overlay/image-select-overlay.component';
import { HttpClientService } from '../../../services/http-client.service';
import { OverlayService } from '../../dialogs/overlay/overlay.service';
import { Overlay } from '@angular/cdk/overlay';
import { Globals } from '../../../services/globals';
import { lastValueFrom } from 'rxjs';
import { NPC, NpcAttributes } from '../../../services/phaser/entities/registry/npc';

@Component({
	selector: 'app-character-widget',
	templateUrl: './character-widget.component.html',
	styleUrls: ['./character-widget.component.scss', '../widget.scss']
})
export class CharacterWidgetComponent extends OverlayWidget<NpcAttributes> {
	
	private characterNameKey: keyof NpcAttributes = 'characterName';
	
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
		
		this.comp.title = 'Character Name';
		this.comp.splitBaseName = CharacterWidgetComponent.name;
		
		this.comp.rightGroups = [this.rightGroup];
		
		this.comp.exit.subscribe(() => {
			this.close();
		});
		
		this.comp.leftGroup.click = prop => {
			const prefix = this.settings.characterName?.split('.')?.[0];
			if (prop === prefix) {
				return;
			}
			this.setPropType(this.props.find(v => v.prefix === prop)?.full ?? '', true);
		};
		this.rightGroup.click = prop => this.setPropType(prop);
		
		this.setPropType(this.settings.characterName ?? '');
		await this.updateProps();
		this.updateRightSide();
		
		return obj.ref;
	}
	
	private setPropType(prop: string, updateRightSide = false) {
		const first = prop.split('.')?.[0];
		this.comp.leftGroup.selected = first;
		this.rightGroup.selected = prop;
		if (this.settings.characterName === prop) {
			return;
		}
		this.setSetting(this.characterNameKey, prop);
		if (updateRightSide) {
			this.updateRightSide();
		}
	}
	
	private updateRightSide() {
		const prefix = this.settings.characterName?.split('.')?.[0];
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
		
		const entityClass = Globals.entityRegistry.getEntity('NPC');
		const npcEntity = new entityClass(Globals.scene, Globals.map, -999999, 0, 'NPC') as unknown as NPC;
		
		const chars = (await lastValueFrom(this.http.getCharacters())).map(v => v.replaceAll('/', '.'));
		
		for (const char of chars) {
			const prop: typeof this.props[0] = {
				prefix: char.split('.')[0],
				full: char,
				img: await this.generateImage<NpcAttributes>({characterName: char}, npcEntity)
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
		
		npcEntity.destroy();
	}
}
