import { Component, OnInit, inject } from '@angular/core';
import { SearchFilterService } from '../../../services/search-filter.service';
import { AbstractWidget } from '../abstract-widget';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatTooltip } from '@angular/material/tooltip';
import { AutocompletedTextboxComponent } from './autocompleted-textbox/autocompleted-textbox.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-string-widget',
    templateUrl: './string-widget.component.html',
    styleUrls: ['./string-widget.component.scss', '../widget.scss'],
    imports: [FlexModule, MatTooltip, AutocompletedTextboxComponent, FormsModule]
})
export class StringWidgetComponent extends AbstractWidget implements OnInit {
	private searchFilterService = inject(SearchFilterService);

	
	keys: string[] = [];
	disableTooltip = false;
	
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
