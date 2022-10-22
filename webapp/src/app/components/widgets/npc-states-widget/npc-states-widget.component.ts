import { Overlay } from '@angular/cdk/overlay';
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { OverlayRefControl } from '../../../components/dialogs/overlay/overlay-ref-control';
import { OverlayService } from '../../../components/dialogs/overlay/overlay.service';
import { EventArray } from '../../../models/events';
import { AbstractWidget } from '../abstract-widget';
import { NpcStatesComponent } from './npc-states/npc-states.component';

export interface NPCState {
	reactType: string;
	pageName?: string;
	face: string;
	action: any;
	hidden: boolean;
	position?: {
		x: number;
		y: number;
		lvl: any;
		active?: boolean;
	};
	condition: string;
	config: string;
	event: EventArray;
}

@Component({
	selector: 'app-npcstates-widget',
	templateUrl: './npc-states-widget.component.html',
	styleUrls: ['./npc-states-widget.component.scss', '../widget.scss']
})
export class NPCStatesWidgetComponent extends AbstractWidget implements OnInit, OnChanges, OnDestroy {
	
	npcStates: NPCState[] = [];
	private ref?: OverlayRefControl;
	
	constructor(private overlayService: OverlayService,
				private overlay: Overlay) {
		super();
	}
	
	ngOnChanges(): void {
		super.ngOnChanges();
		this.npcStates = this.settings[this.key];
		if (!this.npcStates) {
			this.npcStates = [];
			this.settings[this.key] = this.npcStates;
		}
	}
	
	ngOnDestroy() {
		if (this.ref) {
			this.ref.close();
		}
	}
	
	open() {
		if (this.ref && this.ref.isOpen()) {
			return;
		}
		const obj = this.overlayService.open(NpcStatesComponent, {
			positionStrategy: this.overlay.position().global()
				.left('23vw')
				.top('calc(64px + 6vh / 2)'),
			hasBackdrop: true,
			disablePhaserInput: true
		});
		
		this.ref = obj.ref;
		
		obj.instance.states = JSON.parse(JSON.stringify(this.npcStates));
		
		obj.instance.exit.subscribe((v: any) => {
			obj.ref.close();
			this.settings[this.key] = v;
			this.npcStates = v;
			this.updateType(v);
		}, () => obj.ref.close());
	}
	
	
}
