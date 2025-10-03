import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class SearchFilterService {
	NEUTRAL_CHAR_REGEX = /[-_\s]*/g;

	private escapeRegExp(text: string) {
		//https://stackoverflow.com/a/6969486
		return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

	private innerTest(tested: string, searched: RegExp) {
		const result = tested.match(searched) != null;
		return result;
	}

	createSearcherRegex(searched: string, global = false) {
		//Prevents from returning /[-_\s]*/g for strings like '_', which would always match and cause problems with highlighting.
		if (searched.replace(this.NEUTRAL_CHAR_REGEX, '') === '') {
			return /[-_\s]+/g;
		}

		const characters = searched.split(this.NEUTRAL_CHAR_REGEX);
		const escapedCharacters = characters.map((token) =>
			this.escapeRegExp(token),
		);
		const regex = escapedCharacters.join(this.NEUTRAL_CHAR_REGEX.source);
		return new RegExp(regex, global ? 'gi' : 'i');
	}

	test(tested: string, searched?: string | null) {
		searched = searched?.trim();
		if (!searched) {
			return true;
		} else {
			return this.innerTest(tested, this.createSearcherRegex(searched));
		}
	}

	filterOptions(options: readonly string[], searched?: string | null) {
		searched = searched?.trim();
		if (!searched) {
			return [...options]; //By returning a copy it's always safe to modify the result.
		} else {
			const regex = this.createSearcherRegex(searched);
			const filtered = options.filter((tested) =>
				this.innerTest(tested, regex),
			);

			// move exact match to first position
			const lowercase = searched.toLowerCase();
			const exactIndex = filtered.findIndex(
				(v) => v.toLowerCase() === lowercase,
			);
			if (exactIndex > 0) {
				const exact = filtered.splice(exactIndex, 1)[0];
				filtered.unshift(exact);
			}
			return filtered;
		}
	}
}
