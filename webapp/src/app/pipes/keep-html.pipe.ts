import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
	name: 'keepHtml',
	pure: false,
})
export class KeepHtmlPipe implements PipeTransform {
	private sanitizer = inject(DomSanitizer);

	transform(content: string) {
		return this.sanitizer.bypassSecurityTrustHtml(content);
	}
}
