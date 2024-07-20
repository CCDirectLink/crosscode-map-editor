import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { ColorService } from '../services/color.service';

@Directive({
	selector: '[appColoredText]',
	standalone: true
})
export class ColoredTextDirective implements OnChanges {

	@Input({ required: true }) appColoredText!: string;

	constructor(
		private element: ElementRef,
		private colorService: ColorService,
	) { }

	ngOnChanges(): void {
		this.element.nativeElement.innerHTML = this.colorService.processText(this.appColoredText);
	}
}
