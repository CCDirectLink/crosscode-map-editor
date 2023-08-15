import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-floating-window',
	templateUrl: './floating-window.component.html',
	styleUrls: ['./floating-window.component.scss']
})
export class FloatingWindowComponent implements OnInit, OnChanges {
	
	@Input() visible = true;
	@Input() title = 'no title';
	
	@Input() height = '';
	@Input() width = '';
	@Input() top: string | number = 0;
	@Input() right: string | number = 0;
	
	@Input() showClose = false;
	@Input() showMin = true;
	
	@Output() close = new EventEmitter<void>();
	@Output() dragEnd = new EventEmitter<void>();
	
	contentStyle = {
		height: this.height,
		display: ''
	};
	
	constructor() {
	}
	
	ngOnInit() {
		this.updateContentStyle();
	}
	
	ngOnChanges(changes: SimpleChanges): void {
		if (changes['visible']) {
			this.updateContentStyle();
		}
	}
	
	private updateContentStyle() {
		this.contentStyle = {
			height: this.visible ? this.height : '0',
			display: this.visible ? 'inherit' : 'none'
		};
	}
	
	onDragEnd() {
		this.dragEnd.emit();
	}
	
	toggle() {
		this.visible = !this.visible;
		this.updateContentStyle();
	}
	
	onClose() {
		this.close.emit();
	}
	
}
