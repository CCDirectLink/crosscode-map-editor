import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { SearchFilterService } from '../services/search-filter.service';

@Directive({
	selector: '[appHighlight]',
	standalone: true
})
export class HighlightDirective implements OnChanges {
	
	@Input() highlightText?: string;
	@Input() highlightMatch?: string;
	
	constructor(
		private element: ElementRef,
		private searchFilterService: SearchFilterService,
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
		
		const highlightPattern = this.searchFilterService.createSearcherRegex(this.highlightMatch, true);
		const highlights = this.highlightText.match(highlightPattern);
		if (!highlights) {
			return this.highlightText;
		}
		const plains = this.highlightText.split(highlightPattern);
		const result = highlights.map((highlight, i) => plains[i] + `<span class="highlight">${highlight}</span>`).join('');
		return result + plains[plains.length - 1];
	}
}
