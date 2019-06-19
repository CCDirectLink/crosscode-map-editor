import {
	Component,
	ComponentFactoryResolver, EventEmitter,
	Input,
	OnDestroy,
	OnInit, Output,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HostDirective} from '../../../../host.directive';
import {CCEntity} from '../../../../phaser/entities/cc-entity';
import {AbstractWidget} from '../../../abstract-widget';
import {WidgetRegistryService} from '../../../widget-registry.service';
import {NPCState} from '../../../npc-states-widget/npc-states-widget.component';
import {JsonWidgetComponent} from '../../../json-widget/json-widget.component';
import {EventHelperService} from '../event-helper.service';

const ANIMATION_TIMING = '300ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
	animations: [
		trigger('slideContent', [
			state('void', style({transform: 'scale(0.7)', opacity: 0})),
			state('enter', style({transform: 'scale(1)', opacity: 1})),
			transition('* => *', animate(ANIMATION_TIMING)),
		])
	],
	selector: 'app-event-detail',
	templateUrl: './event-detail.component.html',
	styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
	@ViewChild(HostDirective, { static: false }) appHost: HostDirective;
	
	@Input() event: AbstractEvent<any>;
	@Output() exit: EventEmitter<AbstractEvent<any>> = new EventEmitter<any>();
	
	animState = 'enter';
	newData;
	unknownObj;
	warning;
	
	constructor(private componentFactoryResolver: ComponentFactoryResolver,
	            private widgetRegistry: WidgetRegistryService,
	            private helper: EventHelperService) {
	}
	
	ngOnInit(): void {
		console.log(this.event);
		this.loadSettings();
	}
	
	save() {
		this.event.data = this.unknownObj ? this.unknownObj.data : this.newData;
		this.exit.emit(this.event);
	}
	
	cancel() {
		this.exit.error('cancel');
	}
	
	private loadSettings() {
		const ref = this.appHost.viewContainerRef;
		const exported = this.event.export();
		this.newData = this.helper.getEventFromType(exported).data;
		
		if (!this.event.getAttributes) {
			console.log('wtf', this);
		}
		const attributes = this.event.getAttributes();
		if (attributes) {
			this.warning = false;
			Object.entries(attributes).forEach(([key, val]) => {
				this.generateWidget(this.newData, key, val, ref);
			});
		} else {
			this.warning = true;
			this.unknownObj = {data: this.newData};
			const instance: JsonWidgetComponent = <any>this.generateWidget(this.unknownObj, 'data', {}, ref);
			instance.noPropName = true;
		}
	}
	
	private generateWidget(data, key: string, val, ref: ViewContainerRef) {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.widgetRegistry.getWidget(val.type));
		const componentRef = ref.createComponent(componentFactory);
		const instance = <AbstractWidget>componentRef.instance;
		instance.custom = data;
		instance.key = key;
		instance.attribute = val;
		return instance;
	}
}
