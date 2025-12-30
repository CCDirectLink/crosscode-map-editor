import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';
import { ColorService } from '../services/color.service';

@Directive({
	selector: '[appColoredText]',
	standalone: true
})
export class ColoredTextDirective implements OnChanges {
	private element = inject(ElementRef);
	private colorService = inject(ColorService);


	@Input({ required: true }) appColoredText!: string;

	ngOnChanges(): void {
		this.element.nativeElement.innerHTML = this.colorService.processText(this.appColoredText);
	}
}
