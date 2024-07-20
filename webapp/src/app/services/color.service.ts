import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ColorService {
	public processText(text: string): string {
		const textColors = [
			null,	   // \c[0] White
			'#ff6969', // \c[1] Red
			'#65ff89', // \c[2] Green
			'#ffe430', // \c[3] Yellow
			'#808080', // \c[4] Gray
			//'#ff8932',  \c[5] Orange, only used for small font in vanilla
		];

		let inSpan = false;
		text = text.replace(/\\c\[(\d+)\]|$/g, (substr, colorIndex) => {
			const color = textColors[+colorIndex];
			let replacement = '';
			if (inSpan) {
				replacement += '</span>';
				inSpan = false;
			}
			if (color) {
				replacement += `<span style="color: ${color}">`;
				inSpan = true;
			} else if (color !== null) {
				//preserve the original color code untouched.
				replacement += substr;
			}
			return replacement;
		});

		return text;
	}
}
