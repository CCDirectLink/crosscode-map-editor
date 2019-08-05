import {
	Component,
	ComponentFactoryResolver,
	Input,
	OnChanges, OnDestroy,
	OnInit,
	SimpleChanges
} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {NpcStatesComponent} from './npc-states/npc-states.component';
import {OverlayService} from '../../../overlay/overlay.service';
import {OverlayRefControl} from '../../../overlay/overlay-ref-control';
import {Overlay} from '@angular/cdk/overlay';

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
	event: any;
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
	
	ngOnChanges(changes: SimpleChanges): void {
		super.ngOnChanges(changes);
		this.npcStates = this.settings[this.key];
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
			hasBackdrop: true
		});
		
		this.ref = obj.ref;
		
		obj.instance.states = JSON.parse(JSON.stringify(this.npcStates));
		
		obj.instance.exit.subscribe((v: any) => {
			obj.ref.close();
			this.settings[this.key] = v;
			this.npcStates = v;
			this.updateType();
		}, () => obj.ref.close());
	}
	
	
}
