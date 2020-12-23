import {
	Component,
	ComponentFactoryResolver,
	EventEmitter,
	HostBinding,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { AbstractEvent } from '../../event-registry/abstract-event';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HostDirective } from '../../../../host.directive';
import { AttributeValue } from '../../../../phaser/entities/cc-entity';
import { AbstractWidget } from '../../../abstract-widget';
import { WidgetRegistryService } from '../../../widget-registry.service';
import { JsonWidgetComponent } from '../../../json-widget/json-widget.component';
import { EventHelperService } from '../event-helper.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-event-detail',
	templateUrl: './event-detail.component.html',
	styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit, OnDestroy {
	@ViewChild(HostDirective, {static: true}) appHost!: HostDirective;
	
	@Input() event!: AbstractEvent<any>;
	@Output() close = new EventEmitter<void>();
	@Output() refresh = new EventEmitter<AbstractEvent<any>>();
	
	newData: any;
	unknownObj?: { data: any };
	warning = false;
	
	private changeSubscriptions: Subscription[] = [];
	
	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private widgetRegistry: WidgetRegistryService,
		private helper: EventHelperService
	) {
	}
	
	ngOnDestroy(): void {
		this.clearSubscriptions();
	}
	
	ngOnInit(): void {
		this.helper.selectedEvent.subscribe(selected => {
			if (selected) {
				this.event = selected;
				this.loadSettings();
			}
		});
	}
	
	closeDetails(): void {
		this.close.emit();
	}
	
	private clearSubscriptions() {
		for (const sub of this.changeSubscriptions) {
			sub.unsubscribe();
		}
		this.changeSubscriptions = [];
	}

	private loadSettings() {
		this.clearSubscriptions();

		const ref = this.appHost.viewContainerRef;
		
		ref.clear();
		
		const exported = this.event.export();
		this.newData = this.helper.getEventFromType(exported, this.event.actionStep).data;
		
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
			const instance = this.generateWidget(this.unknownObj, 'data', {
				type: '',
				description: ''
			}, ref) as JsonWidgetComponent;
			instance.noPropName = true;
		}
	}
	
	private generateWidget(data: any, key: string, val: AttributeValue, ref: ViewContainerRef) {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.widgetRegistry.getWidget(val.type));
		const componentRef = ref.createComponent(componentFactory);
		const instance = <AbstractWidget>componentRef.instance;
		instance.custom = data;
		instance.key = key;
		instance.attribute = val;
		const sub = instance.onChange.subscribe(() => this.update());
		this.changeSubscriptions.push(sub);
		return instance;
	}
	
	private update() {
		this.event.data = this.unknownObj ? this.unknownObj.data : this.newData;
		this.event.update();
		this.refresh.emit(this.event);
	}
}
