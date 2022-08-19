import {Injectable} from '@angular/core';

@Injectable()
export class SearchFilterService {
	CHARACTER_CONVERSIONS: readonly (readonly string[])[] = [
		['_', ''],
		['_', ' '],
		['-', ''],
		['-', ' '],
	];
	
	private innerTest(tested: string, searched: string) {
		tested = tested.toLowerCase();
		for (const [found, replaced] of this.CHARACTER_CONVERSIONS) {
			if (tested.replace(found, replaced).includes(searched)) {
				return true;
			}
		}
		return tested.includes(searched);
	}
	
	test(tested: string, searched: string) {
		if (searched === '') {
			return true;
		} else {
			return this.innerTest(tested, searched);
		}
	}
	
	filterOptions(options: string[], searched: string) {
		searched = searched.trim();
		if (searched === '') {
			return options;
		}
		searched = searched.toLowerCase();
		return options.filter(tested => this.innerTest(tested, searched));
	}
}
