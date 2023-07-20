import { Pipe, PipeTransform } from '@angular/core';
import { PropListCard } from '../image-select-card/image-select-card.component';

@Pipe({
	name: 'listFilter',
	standalone: true
})
export class ListFilterPipe implements PipeTransform {
	
	transform(items: PropListCard[], filter?: string): PropListCard[] {
		if (!filter) {
			return items;
		}
		return items.filter(v => v.name.toLowerCase().includes(filter.toLowerCase().trim()));
	}
	
}
