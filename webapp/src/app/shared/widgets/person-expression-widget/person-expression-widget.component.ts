import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-person-expression-widget',
	templateUrl: './person-expression-widget.component.html',
	styleUrls: ['./person-expression-widget.component.scss', '../widget.scss']
})
export class PersonExpressionWidgetComponent extends AbstractWidget implements OnChanges {
	
	constructor() {
		super();
	}
	
	ngOnChanges(changes?: SimpleChanges): void {
		super.ngOnChanges(changes);
		if (!this.settings[this.key]) {
			this.settings[this.key] = {
				person: '',
				expression: ''
			};
		}
	}
}
