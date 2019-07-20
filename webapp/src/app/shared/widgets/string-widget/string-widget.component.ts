import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-string-widget',
	templateUrl: './string-widget.component.html',
	styleUrls: ['./string-widget.component.scss', '../widget.scss']
})
export class StringWidgetComponent extends AbstractWidget implements OnInit {
	
	keys: string[] = [];
	valueType: string = "value";
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

	onContextMenu() {
		alert('Context menu clicked.');
	}
}
