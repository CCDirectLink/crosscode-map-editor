import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'app-floating-window',
	templateUrl: './floating-window.component.html',
	styleUrls: ['./floating-window.component.scss']
})
export class FloatingWindowComponent implements OnInit {
	
	@Input() visible = true;
	@Input() title: string;
	
	@Input() height: string;
	@Input() width: string;
	@Input() top: string | number = 0;
	@Input() right: string | number = 0;
	
	@Input() showClose = false;
	@Input() showMin = true;
	
	@Output() close = new EventEmitter<void>();
	
	constructor() {
	}
	
	ngOnInit() {
	}
	
	onDragEnd($event) {
		// console.log($event);
	}
	
	toggle() {
		this.visible = !this.visible;
	}
	
	onClose() {
		this.close.emit();
	}
	
}
