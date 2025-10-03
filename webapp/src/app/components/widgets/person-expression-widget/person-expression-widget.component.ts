import { Component, OnChanges } from '@angular/core';
import { AbstractWidget } from '../abstract-widget';

@Component({
	selector: 'app-person-expression-widget',
	templateUrl: './person-expression-widget.component.html',
	styleUrls: ['./person-expression-widget.component.scss', '../widget.scss'],
	standalone: false,
})
export class PersonExpressionWidgetComponent
	extends AbstractWidget
	implements OnChanges
{
	constructor() {
		super();
	}

	override ngOnChanges(): void {
		super.ngOnChanges();
		if (!this.settings[this.key]) {
			this.settings[this.key] = {
				person: '',
				expression: '',
			};
		}
	}
}
