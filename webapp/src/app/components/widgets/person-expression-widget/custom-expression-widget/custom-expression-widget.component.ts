import { Component, OnChanges } from '@angular/core';
import { OverlayWidget } from '../../overlay-widget';
import { ImageSelectOverlayComponent } from '../../shared/image-select-overlay/image-select-overlay.component';
import { HttpClientService } from '../../../../services/http-client.service';
import { OverlayService } from '../../../dialogs/overlay/overlay.service';
import { Overlay } from '@angular/cdk/overlay';
import { PropListCard } from '../../shared/image-select-overlay/image-select-card/image-select-card.component';
import { Helper } from '../../../../services/phaser/helper';
import { CharacterSettings, Face } from '../../../../services/phaser/entities/registry/npc';
import { Person } from '../../../../models/events';
import { prepareSheet } from '../../../../services/phaser/sheet-parser';
import AbstractFaces from '../../../../../assets/abstract-faces.json';
import { getNPCTemplates } from '../../../../services/phaser/entities/registry/npc-templates';
import { ExpressionRendererEntity, ExpressionRendererSettings } from './expression-renderer-entity';
import { Globals } from '../../../../services/globals';

@Component({
	selector: 'app-custom-expression-widget',
	templateUrl: './custom-expression-widget.component.html',
	styleUrls: ['./custom-expression-widget.component.scss', '../../widget.scss']
})
export class CustomExpressionWidgetComponent extends OverlayWidget<Person> implements OnChanges {
	
	private comp: ImageSelectOverlayComponent = new ImageSelectOverlayComponent();
	preview = '';
	
	constructor(
		private http: HttpClientService,
		overlayService: OverlayService,
		overlay: Overlay
	) {
		super(overlayService, overlay);
	}
	
	override async ngOnChanges() {
		super.ngOnChanges();
		await this.updatePreviewImg();
	}
	
	override async openInternal() {
		const obj = this.overlayService.open(ImageSelectOverlayComponent, {
			positionStrategy: this.overlay.position().global(),
			hasBackdrop: false,
			disablePhaserInput: true
		});
		
		this.comp = obj.instance;
		
		this.comp.title = 'Expression';
		this.comp.splitBaseName = CustomExpressionWidgetComponent.name;
		this.comp.showRightProps = false;
		
		this.comp.exit.subscribe(() => {
			this.close();
			this.updatePreviewImg();
		});
		
		this.comp.leftGroup.click = prop => this.setExpression(prop);
		
		const expression = this.settings.expression ?? '';
		
		this.comp.manualKey = this.key;
		this.comp.manualValue = expression;
		this.comp.manualValueChange.subscribe(v => this.setExpression(v));
		
		this.setExpression(this.settings.expression);
		await this.updateFaces();
		
		return obj.ref;
	}
	
	private async updatePreviewImg() {
		const face = await this.getFace();
		this.preview = await this.makeImage(face, this.settings.expression);
	}
	
	private setExpression(prop?: string) {
		this.comp.leftGroup.selected = prop;
		if (this.settings.expression === prop) {
			return;
		}
		this.setSetting(this.key, prop);
		this.comp.manualValue = prop;
	}
	
	private async updateFaces() {
		const expressions: PropListCard[] = [];
		this.comp.leftGroup.props = [];
		this.comp.loading = true;
		
		const face = await this.getFace();
		
		const faceNames = Object.keys(face.expressions ?? {});
		
		await Promise.all(faceNames.map(async name => {
			expressions.push({
				name: name,
				displayName: name.toLowerCase(),
				imgSrc: await this.makeImage(face, name)
			});
		}));
		expressions.sort((a, b) => a.name.localeCompare(b.name));
		
		this.comp.leftGroup.props = expressions;
		this.comp.loading = false;
	}
	
	private async getFace() {
		const person = (this.settings.person ?? '').replaceAll('.', '/');
		let sheet = (await Helper.getJsonPromise('data/characters/' + person) as CharacterSettings | undefined) ?? {};
		sheet.jsonTEMPLATES = getNPCTemplates();
		sheet = prepareSheet(sheet);
		
		let face: Face = sheet.face ?? {};
		
		if (typeof sheet.face === 'object' && sheet.face?.ABSTRACT) {
			face = AbstractFaces[sheet.face.ABSTRACT as string];
		}
		
		return face;
	}
	
	private async makeImage(face: Face, name: string): Promise<string> {
		const entity = new ExpressionRendererEntity(Globals.scene, Globals.map, -999999, 0, 'Custom');
		return await this.generateImage<ExpressionRendererSettings>({
			face: face,
			expression: name
		}, entity, 32, 1.7);
	}
}
