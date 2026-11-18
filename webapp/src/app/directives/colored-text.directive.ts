import { Directive, ElementRef, Input, OnChanges, SecurityContext, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorService } from '../services/color.service';

@Directive({
	selector: '[appColoredText]',
	standalone: true
})
export class ColoredTextDirective implements OnChanges {
	private element = inject(ElementRef);
	private colorService = inject(ColorService);
	private domSanitizer = inject(DomSanitizer);


	@Input({ required: true }) appColoredText!: string;

	ngOnChanges(): void {
		const text = this.domSanitizer.sanitize(SecurityContext.HTML, this.appColoredText) || '';
		this.element.nativeElement.innerHTML = this.colorService.processText(text);
	}
}
