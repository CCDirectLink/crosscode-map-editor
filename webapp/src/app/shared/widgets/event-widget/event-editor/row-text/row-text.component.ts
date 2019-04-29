import {
	ApplicationRef,
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input, NgZone,
	Output,
	ViewChild,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ChangeDetectorRef
} from '@angular/core';
import {EventHelperService} from '../event-helper.service';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {OverlayService} from '../../../../overlay/overlay.service';
import {Overlay} from '@angular/cdk/overlay';
import {NpcStatesComponent} from '../../../npc-states-widget/npc-states/npc-states.component';
import {EventDetailComponent} from '../detail/event-detail.component';
import {OverlayRefControl} from '../../../../overlay/overlay-ref-control';
import {EventAddComponent} from '../add/event-add.component';
MouseEvent
@Component({
	selector: 'app-row-text',
	templateUrl: './row-text.component.html',
	styleUrls: ['./row-text.component.scss']
})
export class RowTextComponent implements OnInit, AfterViewInit, OnDestroy {
	private static clipboard;
	
	@ViewChild('elementRef') elementRef;
	
	@Input() text;
	@Input() hideGreaterSign = false;
	@Input() placeHolder: boolean;
	@Input() sub : boolean = false;
	@Input() data: AbstractEvent<any>;
	@Output() dataChange = new EventEmitter();
	
	@Input() parent: AbstractEvent<any>[];
	@Output() parentChange = new EventEmitter();
	
	@Output() dblClick = new EventEmitter();
	@Output() click = new EventEmitter();
	
	
	@Input() set parentElement(value) {
		this._parent = value;
		
	}

	get parentElement(): any {
		return this._parent;
	}
	@Input() top;

	private overlayRef: OverlayRefControl;
	private element;
	private _parent;

	constructor(private storage: EventHelperService,
	            private overlayService: OverlayService,
	            private overlay: Overlay,
				private helper: EventHelperService) {
	}
	ngOnInit() {
		if(this._parent) {
			this.getParent().addComponent(this, this.getIndex());
		} else {
			console.log("Could not find parent", this);
		}
	}
	isPlaceHolder() {
		return this.placeHolder;
	}
	ngAfterViewInit() {
		this.element = this.elementRef.nativeElement;
		if(this.isPlaceHolder()) {
			this.element = this.element.querySelector('.no-click');
		}
		if(this.data && (<any>this.data)._pasted) {
			console.log("It's pasted");
			this.helper.selectedEvent.next({
				force: true,
				value : this
			});
		}
	}
	ngOnDestroy() {
	}
	leftClick(event: MouseEvent) {
		event.stopPropagation();
		this.storage.selectedEvent.next(this);
		this.click.emit(this);
	}
	select() {
		this.element.classList.add("selected");
	}
	unselect() {
		this.element.classList.remove("selected");
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
		obj.instance.exit.subscribe(v => {
			this.overlayRef.close();
			this.data = v;
			this.data.update();
			this.dataChange.emit(v);
		}, e => this.overlayRef.close());
		
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
		// Need to figure out how to check for changes
		// and update accordingly.
		obj.instance.getEventClass.subscribe(v => {
			this.overlayRef.close();
			const index = this.getIndex();
			this.parent.splice(index, 0, v);
			this.parentChange.emit(this.parent);
			// it wouldn't update instantly
			// dete
			this.getParent().detectChanges();

		}, e => this.overlayRef.close());
	}
	
	// region keys copy/paste/del
	keyPress(event: KeyboardEvent) {
		event.stopPropagation();
		//console.log(event.code);
		switch (event.code) {
			case 'Delete':
				this.emitDeleteEvent();
				break;
			case 'KeyX':
				if (event.ctrlKey) {
					this.emitCopyAndDeleteEvent();
				}
				break;
			case 'KeyV':
				if (event.ctrlKey) {
					this.emitPasteEvent();
				}
				break;
		}
	}

	getParent() {
		return this._parent;
	}
	copy() {
		if (this.data && !this.isPlaceHolder()) {
			return this.data.export();
		}
	}
	private emitCopyAndDeleteEvent() {
		this.helper.copyAndDeleteEvent.next(this);
		this.helper.copyAndDeleteEvent.next(null);
	}
	private emitDeleteEvent() {
		this.helper.deleteEvent.next(this);
		this.helper.deleteEvent.next(null);
	}
	private emitPasteEvent() {
		if(this.sub) {
			this.helper.pasteEvent.next({
				data : this.parent,
				index : this.getComponentIndex(),
				parent: this.getParent()
			});
		} else {
			this.helper.pasteEvent.next({
				data : this.getParent().getData(),
				index : this.getIndex(),
				parent: this.getParent()
			});			
		}
		
		this.helper.pasteEvent.next(null);
	}
	delete() {
		if (!this.data || this.isPlaceHolder()) {
			return;
		}
		const index = this.getIndex();
		this.parent.splice(index, 1);
	}
	
	// endregion
	
	private getIndex() {
		const index = this.parent.indexOf(this.data);
		return index === -1 ? this.parent.length : index;
	}

	public getComponentIndex() {
		const index = this._parent.getChildComponentIndex(this);
		return index === -1 ? this._parent.getComponentLength() : index;
	}
}
