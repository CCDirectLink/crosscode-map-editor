import {Component, OnInit} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {SearchFilterService} from '../../search-filter.service';
import {HighlightDirective} from '../../highlight.directive';

@Component({
	selector: 'app-string-widget',
	templateUrl: './string-widget.component.html',
	styleUrls: ['./string-widget.component.scss', '../widget.scss']
})
export class StringWidgetComponent extends AbstractWidget implements OnInit {
	
	keys: string[] = [];
	suggestedOptions: string[] = [];
	
	constructor(
		private searchFilterService: SearchFilterService,
	) {
		super();
	}
	
	ngOnInit() {
		super.ngOnInit();
		const attr = this.attribute;
		if (attr && attr.options) {
			this.keys = Object.keys(attr.options);
			if (attr.withNull) {
				this.keys.unshift('');
			}
		}
		this.updateSuggestedOptions();
	}
	
	updateSuggestedOptions() {
		const inputText = this.settings[this.key];
		const searchResults = this.searchFilterService.filterOptions(this.keys, inputText);
		
		if (searchResults.length === 1 && searchResults[0] === inputText) {
			//This makes it so that if the text is the same as one of the search results all search results are shown (emulates selector-like behaviour).
			this.suggestedOptions = this.keys;
		} else {
			this.suggestedOptions = searchResults;
		}
	}
}
