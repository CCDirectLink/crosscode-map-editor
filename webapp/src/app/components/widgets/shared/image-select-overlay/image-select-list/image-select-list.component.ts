import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSelectCardComponent, PropListCard } from '../image-select-card/image-select-card.component';

@Component({
	selector: 'app-image-select-list',
	standalone: true,
	imports: [CommonModule, ImageSelectCardComponent],
	templateUrl: './image-select-list.component.html',
	styleUrls: ['./image-select-list.component.scss'],
})
export class ImageSelectListComponent {
	@Input() title?: string;
	@Input() selected?: string;
	@Input() items: PropListCard[] = [];
	
	@Output() selectedChange = new EventEmitter<string>();
}
