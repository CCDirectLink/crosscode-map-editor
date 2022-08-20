import {Injectable} from '@angular/core';

@Injectable()
export class SearchFilterService {
	NEUTRAL_CHAR_REGEX = /[-_\s]+/g;
	
	private prepareSearchString(searched?: string | null) {
		return searched?.trim()?.toLowerCase()?.replace(this.NEUTRAL_CHAR_REGEX, '');
	}
	
	private innerTest(tested: string, searched: string) {
		tested = tested.toLowerCase();
		const neutralTested = tested.replace(this.NEUTRAL_CHAR_REGEX, '');
		return neutralTested.includes(searched);
	}
	
	test(tested: string, searched?: string | null) {
		searched = this.prepareSearchString(searched);
		if (!searched) {
			return true;
		} else {
			return this.innerTest(tested, searched);
		}
	}
	
	filterOptions(options: string[], searched?: string | null) {
		searched = this.prepareSearchString(searched);
		if (!searched) {
			return options;
		} else {
			return options.filter(tested => this.innerTest(tested, searched!));
		}
	}
}
