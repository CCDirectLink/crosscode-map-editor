import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'combinedTooltip',
	standalone: true
})
export class CombinedTooltipPipe implements PipeTransform {
	
	transform(v?: string, v2?: string): string {
		return [v, v2].filter(v => !!v).join('\n\n');
	}
	
}
