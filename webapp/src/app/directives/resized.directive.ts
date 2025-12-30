// This code was copied from <https://github.com/vdolek/angular-resize-event/blob/3.2.0/projects/angular-resize-event/src/lib/resized.directive.ts>.

import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output, inject } from '@angular/core';

export interface ResizedEvent {
	newRect: DOMRectReadOnly;
	oldRect?: DOMRectReadOnly;
	isFirst: boolean;
}

@Directive({
	selector: '[appResized]',
	standalone: false
})
export class ResizedDirective implements OnInit, OnDestroy {
	private readonly element = inject(ElementRef);
	private readonly zone = inject(NgZone);

	private observer: ResizeObserver;
	private oldRect?: DOMRectReadOnly;
	
	@Output()
	public readonly appResized;
	
	public constructor() {
		this.appResized = new EventEmitter<ResizedEvent>();
		this.observer = new ResizeObserver((entries) =>
			this.zone.run(() => this.observe(entries))
		);
	}
	
	public ngOnInit(): void {
		this.observer.observe(this.element.nativeElement);
	}
	
	public ngOnDestroy(): void {
		this.observer.disconnect();
	}
	
	private observe(entries: ResizeObserverEntry[]): void {
		const domSize = entries[0];
		const resizedEvent: ResizedEvent = {
			newRect: domSize.contentRect,
			oldRect: this.oldRect,
			isFirst: this.oldRect == null,
		};
		this.oldRect = domSize.contentRect;
		this.appResized.emit(resizedEvent);
	}
}
