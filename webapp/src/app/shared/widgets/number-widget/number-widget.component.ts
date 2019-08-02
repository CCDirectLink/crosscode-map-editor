import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-number-widget',
	templateUrl: './number-widget.component.html',
	styleUrls: ['./number-widget.component.scss', '../widget.scss']
})
export class NumberWidgetComponent extends AbstractWidget implements OnInit {

	setSetting(key: string, value: string) {
		

		const num = parseFloat(value);
		
		if (isNaN(num)) {
			// throw warning
			console.warn(`Input ${value} is not a valid number.`);
			return;
		}

		super.setSetting(key, num);
	}
}
