import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SearchFilterService } from '../../../../services/search-filter.service';

@Component({
	selector: 'app-autocompleted-textbox',
	templateUrl: './autocompleted-textbox.component.html',
	styleUrls: ['./autocompleted-textbox.component.scss', '../../widget.scss'],
	standalone: false
})
export class AutocompletedTextboxComponent implements OnChanges {
	@Input() availableOptions!: string[];
	@Input() text = '';
	@Output() textChange = new EventEmitter<string>();
	@Output() onContainsMouse = new EventEmitter<boolean>();
	suggestedOptions = new Set<string>();
	disableTooltip = false;
	showWarning = false;
	
	constructor(
		private searchFilterService: SearchFilterService,
	) {
	}
	
	ngOnChanges(changes: SimpleChanges) {
		this.updateSuggestedOptions();
	}
	
	updateSuggestedOptions() {
		const inputText = this.text;
		const searchResults = this.searchFilterService.filterOptions(this.availableOptions, inputText);
		
		this.suggestedOptions.clear();
		if (searchResults.includes(inputText)) {
			this.showWarning = false;
			this.onContainsMouse.emit(false);
			//This makes it so that if the text is the same as one of the search results all search results are shown (emulates selector-like behaviour).
			//Matching values are always shown before all the other ones.
			for (const searchResult of searchResults) {
				if (searchResult.length === inputText.length) {
					this.suggestedOptions.add(searchResult);
				}
			}
			searchResults.forEach(searchResult => this.suggestedOptions.add(searchResult));
			this.availableOptions.forEach(option => this.suggestedOptions.add(option));
		} else {
			this.showWarning = true;
			searchResults.forEach(searchResult => this.suggestedOptions.add(searchResult));
		}
	}
}
