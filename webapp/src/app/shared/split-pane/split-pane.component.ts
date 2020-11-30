import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	Input,
	OnInit,
	ViewChild
} from '@angular/core';
import * as BezierEasing from 'bezier-easing';

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
export class SplitPaneComponent implements OnInit {
	
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
	
	/**
	 * gutter position, range [-100, 100], 0 is center
	 * */
	@Input() base = 0;
	
	
	mouseX = 0;
	basisLeft = 0;
	basisRight = 0;
	isOpen = true;
	
	private baseBeforeClose = 0;
	private currentAnim = 0;
	private isDragging = false;
	private offset = 0;
	private scale = 0;
	
	constructor(
		private ref: ChangeDetectorRef
	) {
	}
	
	ngOnInit(): void {
		if (this.base === 100) {
			this.isOpen = false;
		}
		this.valueChanged(this.base);
	}
	
	public openRight() {
		if (this.isOpen) {
			return;
		}
		this.isOpen = true;
		console.log('open right');
		this.animateTo(this.baseBeforeClose, .2);
	}
	
	public closeRight() {
		if (!this.isOpen) {
			return;
		}
		this.isOpen = false;
		console.log('close right');
		this.baseBeforeClose = this.base;
		this.animateTo(100, .2);
	}
	
	private animateTo(val: number, duration: number) {
		const startTime = performance.now();
		const startVal = this.base;
		const that = this;
		const endVal = val;
		duration *= 1000;
		window.cancelAnimationFrame(this.currentAnim);
		const easing = BezierEasing(0.25, 0.1, 0.25, 1.0);
		
		const animLoop = (time: number) => {
			let alpha = (time - startTime) / duration;
			let repeat = true;
			if (alpha >= 1) {
				alpha = 1;
				repeat = false;
			}
			alpha = easing(alpha);
			that.valueChanged((1 - alpha) * startVal + endVal * alpha);
			if (repeat) {
				that.currentAnim = window.requestAnimationFrame(animLoop);
			} else {
				that.currentAnim = 0;
			}
		};
		
		that.currentAnim = window.requestAnimationFrame(animLoop);
	}
	
	valueChanged(val: number, bounds?: Bounds) {
		const boundsRight = (bounds?.right ?? 0) * 2;
		const boundsLeft = (bounds?.left ?? 0) * 2;
		val = Math.min(Math.max(val, -100 + boundsLeft), 100 - boundsRight);
		this.base = val;
		
		this.basisLeft = Math.max(0, this.base);
		this.basisRight = Math.max(0, -this.base);
		
		this.ref.detectChanges();
	}
	
	dragStart(event: MouseEvent) {
		event.preventDefault();
		this.isDragging = true;
		const el = this.container.nativeElement;
		const rect = el.getBoundingClientRect();
		
		this.offset = rect.left;
		this.scale = 1 / rect.width;
	}
	
	dragEnd(event: MouseEvent) {
		event.preventDefault();
		this.isDragging = false;
	}
	
	drag(event: MouseEvent) {
		let val = (event.clientX - this.offset) * this.scale;
		val = Math.min(Math.max(0, val), 1);
		this.valueChanged((val - 0.5) * 200, this.bounds);
	}
}
