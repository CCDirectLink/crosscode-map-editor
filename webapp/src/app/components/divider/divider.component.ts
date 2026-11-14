import { Component, input } from '@angular/core';

@Component({
	imports: [],
	selector: 'app-divider',
	styleUrl: './divider.component.scss',
	template: '',
	host: {
		'[style.margin-left.px]': '-margin()',
		'[style.margin-right.px]': '-margin()',
	},
})
export class DividerComponent {
	margin = input(0);
}
