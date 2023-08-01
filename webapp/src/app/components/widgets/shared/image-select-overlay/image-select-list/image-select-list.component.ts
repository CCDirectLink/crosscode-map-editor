import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSelectCardComponent, PropListCard } from '../image-select-card/image-select-card.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ListFilterPipe } from './list-filter.pipe';
import { AutofocusDirective } from '../../../../../directives/autofocus.directive';

@Component({
	selector: 'app-image-select-list',
	standalone: true,
	imports: [CommonModule, ImageSelectCardComponent, MatInputModule, MatIconModule, FormsModule, MatButtonModule, ListFilterPipe, AutofocusDirective],
	templateUrl: './image-select-list.component.html',
	styleUrls: ['./image-select-list.component.scss'],
})
export class ImageSelectListComponent {
	@Input() title?: string;
	@Input() selected?: string;
	@Input() items: PropListCard[] = [];
	@Input() showFilter = false;
	@Input() filterItems = true;
	
	@Input() filter = '';
	@Output() filterChange = new EventEmitter<string>();
	
	@Output() selectedChange = new EventEmitter<string>();
}
