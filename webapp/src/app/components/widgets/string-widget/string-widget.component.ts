import { Component, OnInit } from '@angular/core';
import { SearchFilterService } from '../../../services/search-filter.service';
import { AbstractWidget } from '../abstract-widget';

@Component({
	selector: 'app-string-widget',
	templateUrl: './string-widget.component.html',
	styleUrls: ['./string-widget.component.scss', '../widget.scss']
})
export class StringWidgetComponent extends AbstractWidget implements OnInit {
	
	keys: string[] = [];
	disableTooltip = false;
	
	constructor(
		private searchFilterService: SearchFilterService,
	) {
		super();
	}
	
	override ngOnInit() {
		super.ngOnInit();
		const attr = this.attribute;
		if (attr && attr.options) {
			this.keys = Object.keys(attr.options);
			if (attr.withNull) {
				this.keys.unshift('');
			}
		}
	}
}
