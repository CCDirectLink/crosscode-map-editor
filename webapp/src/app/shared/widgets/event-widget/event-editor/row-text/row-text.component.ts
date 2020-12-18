import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {EventHelperService} from '../event-helper.service';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {AddEventService} from '../add/add-event.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-row-text',
	templateUrl: './row-text.component.html',
	styleUrls: ['./row-text.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowTextComponent implements OnDestroy {
	private static clipboard: any;
	
	@Input() text?: string;
	@Input() actionStep = false;
	
	@Input() data?: AbstractEvent<any>;
	@Input() parent!: AbstractEvent<any>[];

	@Output() dataChange = new EventEmitter<void>();

	selected = false;
	selectedSubscription: Subscription;
	
	constructor(
		private helper: EventHelperService,
		private addEvent: AddEventService
	) {
		this.selectedSubscription = this.helper.selectedEvent.subscribe(event => {
			this.selected = !!event && event === this.data;
		});
	}

	ngOnDestroy(): void {
		this.selectedSubscription.unsubscribe();
	}
	
	leftClick(event: MouseEvent) {
		event.stopPropagation();
		if (this.data) {
			this.helper.selectedEvent.next(this.data);
		}
	}
	
	openAddMenu(event: MouseEvent) {
		event.stopPropagation();
		
		this.addEvent.showAddEventMenu({
			left: 'calc(18vw)',
			top: '6vh'
		}, this.actionStep).subscribe(event => {
			const index = this.getIndex();
			this.parent.splice(index, 0, event);
			this.dataChange.emit();
			this.helper.selectedEvent.next(event);
		});
	}
	
	// region keys copy/paste/del
	keyPress(event: KeyboardEvent) {
		event.stopPropagation();
		if (event.code === 'Delete') {
			this.delete();
			return;
		}
		if (!event.ctrlKey) {
			return;
		}
		switch (event.key.toLowerCase()) {
		case 'c':
			this.copy();
			break;
		case 'x':
			this.copy();
			this.delete();
			break;
		case 'v':
			this.paste();
			break;
		}
	}
	
	private copy() {
		if (this.data) {
			RowTextComponent.clipboard = this.data.export();
		}
	}
	
	private paste() {
		const clipboard = RowTextComponent.clipboard;
		if (clipboard) {
			const index = this.getIndex();
			const cpy = JSON.parse(JSON.stringify(clipboard));
			const event = this.helper.getEventFromType(cpy, this.actionStep);
			this.parent.splice(index, 0, event);
			this.dataChange.emit();
			this.helper.selectedEvent.next(event);
		}
	}
	
	private delete() {
		if (!this.data) {
			return;
		}
		const index = this.getIndex();
		this.parent.splice(index, 1);
		this.dataChange.emit();
		this.helper.selectedEvent.next(null);
	}
	
	// endregion
	
	private getIndex() {
		const index = this.parent.indexOf(this.data!);
		return index === -1 ? this.parent.length : index;
	}
}
