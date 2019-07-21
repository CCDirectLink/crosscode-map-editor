import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';
import {AbstractExpressionWidget} from '../abstract-expression-widget/abstract-expression-widget.component';
@Component({
	selector: 'app-string-widget',
	templateUrl: './string-widget.component.html',
	styleUrls: ['./string-widget.component.scss', '../widget.scss']
})
export class StringWidgetComponent extends AbstractExpressionWidget implements OnInit {
	
	keys: string[] = [];

	constructor() {
		super();
	}
	
	ngOnInit() {
		
		super.ngOnInit();
		const attr = this.attribute;
		if (attr && attr.options) {
			this.keys = Object.keys(attr.options);
		}
	}
}
