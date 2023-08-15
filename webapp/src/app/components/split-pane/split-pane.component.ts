import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';

/** values in % [0, 100] */
export interface Bounds {
	left?: number;
	right?: number;
}

@Component({
	selector: 'app-split-pane',
	templateUrl: './split-pane.component.html',
	styleUrls: ['./split-pane.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitPaneComponent implements OnInit, OnChanges {
	
	@ViewChild('container') container!: ElementRef<HTMLElement>;
	
	@HostListener('document:mousemove', ['$event'])
	mouseMove(event: MouseEvent) {
		if (this.isDragging) {
			this.drag(event);
		}
	}
	
	@HostListener('document:mouseup', ['$event'])
	mouseUp(event: MouseEvent) {
		if (this.isDragging) {
			this.dragEnd(event);
		}
	}
	
	@Input() bounds?: Bounds;
	@Input() showGutter = false;
	
	/**
	 * gutter position, range [-100, 100], 0 is center
	 * */
	@Input() base = 0;
	@Output() baseChange = new EventEmitter<number>();
	
	@Input() opened = true;
	
	mouseX = 0;
	basisLeft = 0;
	basisRight = 0;
	
	isDragging = false;
	noAnims = false;
	private offset = 0;
	private scale = 0;
	
	constructor(
		private ref: ChangeDetectorRef
	) {
	}
	
	ngOnInit(): void {
		// sets initial values without animating to them
		this.noAnims = true;
		this.valueChanged(this.base);
		setTimeout(() => {
			this.noAnims = false;
		}, 0);
	}
	
	ngOnChanges(changes: SimpleChanges) {
		this.valueChanged(this.base);
	}
	
	valueChanged(val: number, bounds?: Bounds) {
		const boundsRight = (bounds?.right ?? 0) * 2;
		const boundsLeft = (bounds?.left ?? 0) * 2;
		val = Math.min(Math.max(val, -100 + boundsLeft), 100 - boundsRight);
		
		this.basisLeft = Math.max(0, val);
		this.basisRight = Math.max(0, -val);
		this.base = val;
		
		this.baseChange.emit(this.base);
	}
	
	dragStart(event: MouseEvent) {
		event.preventDefault();
		this.isDragging = true;
		this.noAnims = true;
		const el = this.container.nativeElement;
		const rect = el.getBoundingClientRect();
		
		this.offset = rect.left;
		this.scale = 1 / rect.width;
	}
	
	dragEnd(event: MouseEvent) {
		event.preventDefault();
		this.isDragging = false;
		this.noAnims = false;
	}
	
	drag(event: MouseEvent) {
		let val = (event.clientX - this.offset) * this.scale;
		val = Math.min(Math.max(0, val), 1);
		this.valueChanged((val - 0.5) * 200, this.bounds);
	}
}
