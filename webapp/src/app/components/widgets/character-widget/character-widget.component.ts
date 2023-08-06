import { Component, Input } from '@angular/core';
import { OverlayWidget } from '../overlay-widget';
import { ImageSelectOverlayComponent, PropListGroup } from '../shared/image-select-overlay/image-select-overlay.component';
import { HttpClientService } from '../../../services/http-client.service';
import { OverlayService } from '../../dialogs/overlay/overlay.service';
import { Overlay } from '@angular/cdk/overlay';
import { lastValueFrom } from 'rxjs';
import { CharacterSettings, NPC, NpcAttributes } from '../../../services/phaser/entities/registry/npc';
import { Helper } from '../../../services/phaser/helper';

@Component({
	selector: 'app-character-widget',
	templateUrl: './character-widget.component.html',
	styleUrls: ['./character-widget.component.scss', '../widget.scss']
})
export class CharacterWidgetComponent extends OverlayWidget {
	
	@Input() onlyFaces = false;
	
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
			const prefix = this.settings[this.key]?.split('.')?.[0];
			if (prop === prefix) {
				return;
			}
			this.setPropType(this.props.find(v => v.prefix === prop)?.full ?? '', true);
		};
		this.rightGroup.click = prop => this.setPropType(prop);
		
		let ogProp = this.settings?.[this.key];
		if (typeof ogProp !== 'string') {
			ogProp = '';
		}
		
		this.comp.manualKey = this.key;
		this.comp.manualValue = ogProp;
		this.comp.manualValueChange.subscribe(v => this.setPropType(v, true));
		
		this.setPropType(ogProp);
		await this.updateProps();
		this.updateRightSide();
		
		return obj.ref;
	}
	
	private setPropType(prop: string, updateRightSide = false) {
		const first = prop.split('.')?.[0];
		this.comp.leftGroup.selected = first;
		this.rightGroup.selected = prop;
		if (this.settings[this.key] === prop) {
			return;
		}
		this.setSetting(this.key, prop);
		if (updateRightSide) {
			this.updateRightSide();
		}
		this.comp.manualValue = prop;
	}
	
	private updateRightSide() {
		const prefix = this.settings[this.key]?.split('.')?.[0];
		this.rightGroup.props = this.props.filter(v => v.prefix === prefix).map(v => ({
			name: v.full,
			displayName: v.full.split('.')?.[1],
			imgSrc: v.img
		}));
	}
	
	private async updateProps() {
		this.props = [];
		this.comp.loading = true;
		this.comp.leftGroup.props = [];
		this.rightGroup.props = [];
		
		let chars = (await lastValueFrom(this.http.getCharacters())).map(v => v.replaceAll('/', '.'));
		
		if (this.onlyFaces) {
			chars = await Helper.asyncFilter(chars, async v => {
				const name = v.replaceAll('.', '/');
				const settings = await Helper.getJsonPromise('data/characters/' + name) as CharacterSettings | undefined;
				return !!settings?.face;
			});
		}
		
		this.props = await Promise.all(chars.map(async char => {
			const prop: typeof this.props[0] = {
				prefix: char.split('.')[0],
				full: char,
				img: await this.generateImage<NpcAttributes>({characterName: char}, 'NPC')
			};
			return prop;
		}));
		
		this.props.sort((a, b) => a.prefix.localeCompare(b.prefix));
		
		for (const prop of this.props) {
			let el = this.comp.leftGroup.props.find(v => v.name === prop.prefix);
			if (!el) {
				el = {
					name: prop.prefix,
					imgSrc: prop.img,
					searchName: '',
					count: 0
				};
				this.comp.leftGroup.props.push(el);
			}
			el.searchName += prop.full;
			el.count = (el.count ?? 0) + 1;
		}
		
		this.comp.loading = false;
	}
}
