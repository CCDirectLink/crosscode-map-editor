import {
	Component,
	ComponentFactoryResolver,
	Input,
	OnChanges, OnDestroy,
	OnInit,
	SimpleChanges,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {ModalDirective} from '../../modal.directive';
import {StringWidgetComponent} from '../string-widget/string-widget.component';
import {NpcStatesComponent} from './npc-states/npc-states.component';
import {ModalService} from '../../../services/modal.service';

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
	
	@Input() custom = null;
	settings: any;
	npcStates: NPCState[];
	private ref: ViewContainerRef;
	
	constructor(private componentFactoryResolver: ComponentFactoryResolver,
	            private modalService: ModalService) {
		super();
	}
	
	ngOnInit() {
		this.ngOnChanges(null);
		this.ref = this.modalService.modalHost.viewContainerRef;
	}
	
	ngOnChanges(changes: SimpleChanges): void {
		this.settings = this.custom || this.entity.details.settings;
		this.npcStates = this.settings[this.key];
	}
	
	ngOnDestroy() {
		this.ref.clear();
	}
	
	open() {
		this.ref.clear();
		
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NpcStatesComponent);
		const componentRef = this.ref.createComponent(componentFactory);
		const instance = <NpcStatesComponent>componentRef.instance;
		instance.states = JSON.parse(JSON.stringify(this.npcStates));
		instance.exit.subscribe(v => {
			this.ref.clear();
			this.settings[this.key] = v;
			this.npcStates = v;
		}, e => this.ref.clear());
	}
	
	
}
