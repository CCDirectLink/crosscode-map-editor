import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { HostDirective } from '../../../../../directives/host.directive';
import { AttributeValue } from '../../../../../services/phaser/entities/cc-entity';
import { AbstractWidget } from '../../../abstract-widget';
import { JsonWidgetComponent } from '../../../json-widget/json-widget.component';
import { WidgetRegistryService } from '../../../widget-registry.service';
import { AbstractEvent } from '../../event-registry/abstract-event';
import { EventHelperService } from '../event-helper.service';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

export type RefreshType = 'Node' | 'Full';

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.scss'],
    imports: [FlexModule, MatIconButton, MatIcon, HostDirective]
})
export class EventDetailComponent implements OnDestroy {
	private widgetRegistry = inject(WidgetRegistryService);
	private helper = inject(EventHelperService);
	private ref = inject(ChangeDetectorRef);

	@ViewChild(HostDirective, {static: true}) appHost!: HostDirective;
	
	@Input() event!: AbstractEvent<any>;
	@Output() close = new EventEmitter<void>();
	@Output() refresh = new EventEmitter<RefreshType>();
	
	newData: any;
	unknownObj?: { data: any };
	warning = false;
	
	private changeSubscriptions: Subscription[] = [];
	
	ngOnDestroy(): void {
		this.clearSubscriptions();
	}
	
	closeDetails(): void {
		this.close.emit();
	}
	
	public loadEvent(event: AbstractEvent<any>) {
		if (this.event !== event) {
			this.event = event;
			this.loadSettings();
		}
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
		
		this.ref.detectChanges();
	}
	
	private generateWidget(data: any, key: string, val: AttributeValue, ref: ViewContainerRef) {
		const componentRef = ref.createComponent(this.widgetRegistry.getWidget(val.type));
		const instance = componentRef.instance as AbstractWidget;
		instance.custom = data;
		instance.key = key;
		instance.attribute = val;
		const sub = instance.onChange.subscribe(() => this.update());
		
		this.changeSubscriptions.push(sub);
		return instance;
	}
	
	private update() {
		this.event.data = this.unknownObj ? this.unknownObj.data : this.newData;
		const previousChildCount = this.event.children.length;
		this.event.update();
		const childCount = this.event.children.length;
		this.refresh.emit((childCount > 0 || previousChildCount !== childCount) ? 'Full' : 'Node');
	}
}
