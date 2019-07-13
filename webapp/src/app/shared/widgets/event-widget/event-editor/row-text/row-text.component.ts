import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EventHelperService} from '../event-helper.service';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {OverlayService} from '../../../../overlay/overlay.service';
import {Overlay} from '@angular/cdk/overlay';
import {EventDetailComponent} from '../detail/event-detail.component';
import {OverlayRefControl} from '../../../../overlay/overlay-ref-control';
import {EventAddComponent} from '../add/event-add.component';

@Component({
	selector: 'app-row-text',
	templateUrl: './row-text.component.html',
	styleUrls: ['./row-text.component.scss']
})
export class RowTextComponent {
	private static clipboard: any;
	
	@Input() text?: string;
	@Input() hideGreaterSign = false;
	
	@Input() data?: AbstractEvent<any>;
	@Output() dataChange = new EventEmitter();
	
	@Input() parent!: AbstractEvent<any>[];
	@Output() parentChange = new EventEmitter();
	
	@Output() dblClick = new EventEmitter();
	@Output() click = new EventEmitter();
	
	private overlayRef?: OverlayRefControl;
	
	constructor(private storage: EventHelperService,
	            private overlayService: OverlayService,
	            private overlay: Overlay,
	            private helper: EventHelperService) {
	}
	
	leftClick(event: MouseEvent) {
		event.stopPropagation();
		this.storage.selectedEvent.next(this);
		this.click.emit(this);
	}
	
	rightClick(event: MouseEvent) {
		if (!this.data) {
			return false;
		}
		this.leftClick(event);
		
		const obj = this.overlayService.open(EventDetailComponent, {
			positionStrategy: this.overlay.position().global()
				.left('calc(28vw - 110px)')
				.top('calc((64px + 6vh / 2) + 60px)'),
			hasBackdrop: true,
			// backdropClass: '',
			backdropClickClose: true,
		});
		
		this.overlayRef = obj.ref;
		
		obj.instance.event = this.data;
		obj.instance.exit.subscribe((v: AbstractEvent<any>) => {
			obj.ref.close();
			this.data = v;
			v.update();
			this.dataChange.emit(v);
		}, () => obj.ref.close());
		
		return false;
	}
	
	doubleClick(event: MouseEvent) {
		event.stopPropagation();
		this.dblClick.emit(this);
		
		const obj = this.overlayService.open(EventAddComponent, {
			positionStrategy: this.overlay.position().global()
				.left('calc(18vw)')
				.top('6vh'),
			hasBackdrop: true,
			// backdropClass: '',
			backdropClickClose: true,
		});
		
		this.overlayRef = obj.ref;
		
		obj.instance.getEventClass.subscribe((v: AbstractEvent<any>) => {
			obj.ref.close();
			const index = this.getIndex();
			this.parent.splice(index, 0, v);
			this.parentChange.emit(this.parent);
		}, () => obj.ref.close());
	}
	
	// region keys copy/paste/del
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
			case 'KeyX':
				if (event.ctrlKey) {
					this.copy();
					this.delete();
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
			RowTextComponent.clipboard = this.data.export();
		}
	}
	
	private paste() {
		const clipboard = RowTextComponent.clipboard;
		if (clipboard) {
			const index = this.getIndex();
			const cpy = JSON.parse(JSON.stringify(clipboard));
			this.parent.splice(index, 0, this.helper.getEventFromType(cpy));
		}
	}
	
	private delete() {
		if (!this.data) {
			return;
		}
		const index = this.getIndex();
		this.parent.splice(index, 1);
	}
	
	// endregion
	
	private getIndex() {
		const index = this.parent.indexOf(this.data!);
		return index === -1 ? this.parent.length : index;
	}
}
