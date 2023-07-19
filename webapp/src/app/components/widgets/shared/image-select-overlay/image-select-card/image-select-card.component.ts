import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PropListCard {
	name: string;
	imgSrc?: string;
	count?: number;
}

@Component({
	selector: 'app-image-select-card',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './image-select-card.component.html',
	styleUrls: ['./image-select-card.component.scss']
})
export class ImageSelectCardComponent {
	@Input() card: PropListCard = {
		name: '?'
	};
	@Input() selected = false;
	
	@Output() onClick = new EventEmitter<MouseEvent>();
}
