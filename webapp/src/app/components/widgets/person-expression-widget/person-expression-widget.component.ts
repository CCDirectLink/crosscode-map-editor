import { Component, OnChanges } from '@angular/core';
import { AbstractWidget } from '../abstract-widget';
import { CharacterWidgetComponent } from '../character-widget/character-widget.component';
import { CustomExpressionWidgetComponent } from './custom-expression-widget/custom-expression-widget.component';

@Component({
    selector: 'app-person-expression-widget',
    templateUrl: './person-expression-widget.component.html',
    styleUrls: ['./person-expression-widget.component.scss', '../widget.scss'],
    imports: [CharacterWidgetComponent, CustomExpressionWidgetComponent]
})
export class PersonExpressionWidgetComponent extends AbstractWidget implements OnChanges {
	
	constructor() {
		super();
	}
	
	override ngOnChanges(): void {
		super.ngOnChanges();
		if (!this.settings[this.key]) {
			this.settings[this.key] = {
				person: '',
				expression: ''
			};
		}
	}
}
