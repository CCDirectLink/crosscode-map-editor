import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {EventStorageService} from '../event-storage.service';
import {AbstractEvent} from '../../event-registry/abstract-event';

@Component({
	selector: 'app-row-text',
	templateUrl: './row-text.component.html',
	styleUrls: ['./row-text.component.scss']
})
export class RowTextComponent {
	private static clipboard;
	
	@Input() text;
	@Input() data: AbstractEvent<any>;
	@Input() parent: AbstractEvent<any>[];
	@Input() hideGreaterSign = false;
	@Output() dblClick = new EventEmitter();
	@Output() click = new EventEmitter();
	
	constructor(private storage: EventStorageService) {
	}
	
	leftClick(event: MouseEvent) {
		event.stopPropagation();
		this.storage.selectedEvent.next(this);
		this.click.emit(this);
	}
	
	rightClick(event: MouseEvent) {
		this.leftClick(event);
		return false;
	}
	
	doubleClick(event: MouseEvent) {
		event.stopPropagation();
		this.dblClick.emit(this);
	}
	
	keyPress(event: KeyboardEvent) {
		event.stopPropagation();
		console.log(event.code);
		switch (event.code) {
			case 'Delete':
				this.delete();
				break;
			case 'KeyC':
				if (event.ctrlKey) {
					this.copy();
				}
				break;
			case 'KeyV':
				if (event.ctrlKey) {
					this.paste();
				}
				break;
		}
	}
	
	private copy() {
		if (this.data) {
			RowTextComponent.clipboard = JSON.stringify(this.data);
		}
	}
	
	private paste() {
		const clipboard = RowTextComponent.clipboard;
		if (clipboard) {
			const index = this.getIndex();
			this.parent.splice(index, 0, JSON.parse(clipboard));
		}
	}
	
	private delete() {
		if (!this.data) {
			return;
		}
		const index = this.getIndex();
		this.parent.splice(index, 1);
	}
	
	private getIndex() {
		const index = this.parent.indexOf(this.data);
		return index === -1 ? this.parent.length : index;
	}
}
