import { Component, EventEmitter, Input, Output } from '@angular/core';

import { HighlightDirective } from '../../../../../directives/highlight.directive';

export interface PropListCard {
	name: string;
	displayName?: string;
	searchName?: string;
	imgSrc?: string;
	count?: number;
}

@Component({
	selector: 'app-image-select-card',
	imports: [HighlightDirective],
	templateUrl: './image-select-card.component.html',
	styleUrls: ['./image-select-card.component.scss']
})
export class ImageSelectCardComponent {
	@Input() card: PropListCard = {
		name: '?'
	};
	@Input() selected = false;
	@Input() filter = '';
	
	@Output() onClick = new EventEmitter<MouseEvent>();
}
