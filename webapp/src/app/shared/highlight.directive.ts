import {Directive, ElementRef, Input, OnChanges} from '@angular/core';

@Directive({
	selector: '[appHighlight]'
})
export class HighlightDirective implements OnChanges {
	
	@Input() highlightText?: string;
	@Input() highlightMatch?: string;
	
	constructor(
		private element: ElementRef
	) {
	
	}
	
	ngOnChanges(): void {
		this.element.nativeElement.innerHTML = this.highlight();
	}
	
	highlight() {
		if (!this.highlightText) {
			return '';
		}
		if (!this.highlightMatch || this.highlightMatch.length === 0) {
			return this.highlightText;
		}
		const pattern = new RegExp(this.highlightMatch, 'i');
		const match = this.highlightText.match(pattern);
		if (!match) {
			return this.highlightText;
		}
		return this.highlightText.split(match[0]).join(`<span class="highlight">${match[0]}</span>`);
	}
}
