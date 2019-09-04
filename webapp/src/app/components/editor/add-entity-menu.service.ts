import {Injectable} from '@angular/core';
import {OverlayRefControl} from '../../shared/overlay/overlay-ref-control';
import {MapEntity, Point} from '../../models/cross-code-map';
import {GlobalEventsService} from '../../shared/global-events.service';
import {OverlayService} from '../../shared/overlay/overlay.service';
import {Overlay} from '@angular/cdk/overlay';
import {EntityRegistryService} from '../../shared/phaser/entities/registry/entity-registry.service';
import entities from '../../../assets/entities.json';
import {Vec2} from '../../shared/phaser/vec2';
import {ListSearchOverlayComponent} from '../../shared/list-search-overlay/list-search-overlay.component';

@Injectable({
	providedIn: 'root'
})
export class AddEntityMenuService {
	
	private ref?: OverlayRefControl;
	private worldPos: Point = {x: 0, y: 0};
	private mousePos: Point = {x: 0, y: 0};
	
	pos: Point = {x: 0, y: 0};
	keys: string[] = [];
	
	constructor(
		private events: GlobalEventsService,
		private overlayService: OverlayService,
		private overlay: Overlay,
		entityRegistry: EntityRegistryService
	) {
		const registry = Object.keys(entityRegistry.getAll());
		const entityNames = Object.keys(entities);
		
		const eventSet = new Set<string>([...registry, ...entityNames]);
		
		this.keys = Array.from(eventSet);
		this.keys.sort();
		
		document.onmousemove = e => {
			this.mousePos.x = e.pageX;
			this.mousePos.y = e.pageY;
		};
		
		this.events.showAddEntityMenu.subscribe(pos => this.showAddEntityMenu(pos));
	}
	
	showAddEntityMenu(pos: Point) {
		Vec2.assign(this.pos, this.mousePos);
		this.worldPos = pos;
		
		if (this.ref && this.ref.isOpen()) {
			return;
		}
		const obj = this.overlayService.open(ListSearchOverlayComponent, {
			positionStrategy: this.overlay.position().global()
				.left(this.mousePos.x + 'px')
				.top(this.mousePos.y + 'px'),
			height: '50vh',
			backdropClickClose: true,
			hasBackdrop: true,
			disablePhaserInput: true
		});
		this.ref = obj.ref;
		
		obj.instance.list = this.keys;
		obj.instance.animation = 'scale';
		obj.instance.selected.subscribe((v: string) => {
			this.generateEntity(v);
			this.close();
		}, () => this.close());
	}
	
	private close() {
		if (this.ref) {
			this.ref.close();
		}
	}
	
	generateEntity(key: string) {
		const entity: MapEntity = {
			x: this.worldPos.x,
			y: this.worldPos.y,
			type: key,
			level: 0,
			settings: {}
		};
		this.events.generateNewEntity.next(entity);
	}
}
