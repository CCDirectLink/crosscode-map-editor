import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EventHelperService} from '../event-helper.service';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {OverlayService} from '../../../../overlay/overlay.service';
import {Overlay} from '@angular/cdk/overlay';
import {EventDetailComponent} from '../detail/event-detail.component';
import {OverlayRefControl} from '../../../../overlay/overlay-ref-control';
import {AddEventService} from '../add/add-event.service';

@Component({
	selector: 'app-row-text',
	templateUrl: './row-text.component.html',
	styleUrls: ['./row-text.component.scss']
})
export class RowTextComponent {
	private static clipboard: any;
	
	@Input() text?: string;
	@Input() hideGreaterSign = false;
	@Input() actionStep = false;
	
	@Input() data?: AbstractEvent<any>;
	@Input() parent!: AbstractEvent<any>[];

	@Output() dataChange = new EventEmitter<void>();
	@Output() dblClick = new EventEmitter();
	@Output() click = new EventEmitter();
	
	constructor(
		private storage: EventHelperService,
		private overlayService: OverlayService,
		private overlay: Overlay,
		private helper: EventHelperService,
		private addEvent: AddEventService
	) {
	}
	
	leftClick(event: MouseEvent) {
		event.stopPropagation();
		if (this.data) {
			this.storage.selectedEvent.next(this.data);
		}
		this.click.emit(this);
	}
	
	openAddMenu(event: MouseEvent) {
		event.stopPropagation();
		this.dblClick.emit(this);
		
		this.addEvent.showAddEventMenu({
			left: 'calc(18vw)',
			top: '6vh'
		}, this.actionStep).subscribe(event => {
			const index = this.getIndex();
			this.parent.splice(index, 0, event);
			this.dataChange.emit();
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
			this.parent.splice(index, 0, this.helper.getEventFromType(cpy, this.actionStep));
			this.dataChange.emit();
		}
	}
	
	private delete() {
		if (!this.data) {
			return;
		}
		const index = this.getIndex();
		this.parent.splice(index, 1);
		this.dataChange.emit();
	}
	
	// endregion
	
	private getIndex() {
		const index = this.parent.indexOf(this.data!);
		return index === -1 ? this.parent.length : index;
	}
}
