import { Overlay } from '@angular/cdk/overlay';
import { Injectable, inject } from '@angular/core';

import { ListSearchOverlayComponent } from '../components/dialogs/list-search-overlay/list-search-overlay.component';
import { OverlayRefControl } from '../components/dialogs/overlay/overlay-ref-control';
import { OverlayService } from '../components/dialogs/overlay/overlay.service';
import { MapEntity, Point } from '../models/cross-code-map';
import { GlobalEventsService } from './global-events.service';
import { EntityRegistryService } from './phaser/entities/registry/entity-registry.service';
import { Vec2 } from './phaser/vec2';
import { JsonLoaderService } from './json-loader.service';
import { EntitiesJson } from './phaser/entities/registry/default-entity';

@Injectable({
	providedIn: 'root',
})
export class AddEntityMenuService {
	private events = inject(GlobalEventsService);
	private overlayService = inject(OverlayService);
	private overlay = inject(Overlay);
	private entityRegistry = inject(EntityRegistryService);
	private jsonLoader = inject(JsonLoaderService);

	private ref?: OverlayRefControl;
	private worldPos: Point = { x: 0, y: 0 };
	private mousePos: Point = { x: 0, y: 0 };

	pos: Point = { x: 0, y: 0 };
	keys: string[] = [];

	public async init() {
		const entities =
			await this.jsonLoader.loadJsonMerged<EntitiesJson>('entities.json');
		const registry = Object.keys(this.entityRegistry.getAll());
		const entityNames = Object.keys(entities);

		const eventSet = new Set<string>([...registry, ...entityNames]);

		this.keys = Array.from(eventSet);
		this.keys.sort();

		document.onmousemove = (e) => {
			this.mousePos.x = e.pageX;
			this.mousePos.y = e.pageY;
		};

		this.events.showAddEntityMenu.subscribe((pos) =>
			this.showAddEntityMenu(pos),
		);
	}

	showAddEntityMenu(pos: Point) {
		Vec2.assign(this.pos, this.mousePos);
		this.worldPos = pos;

		if (this.ref && this.ref.isOpen()) {
			return;
		}
		const obj = this.overlayService.open(ListSearchOverlayComponent, {
			positionStrategy: this.overlay
				.position()
				.global()
				.left(this.mousePos.x + 'px')
				.top(this.mousePos.y + 'px'),
			height: '50vh',
			backdropClickClose: true,
			hasBackdrop: true,
			disablePhaserInput: true,
		});
		this.ref = obj.ref;

		obj.instance.list = this.keys;
		obj.instance.animation = 'scale';
		obj.instance.selected.subscribe(
			(v: string) => {
				this.generateEntity(v);
				this.close();
			},
			() => this.close(),
		);
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
			settings: {
				size: { x: 16, y: 16 },
			},
		};
		this.events.generateNewEntity.next(entity);
	}
}
