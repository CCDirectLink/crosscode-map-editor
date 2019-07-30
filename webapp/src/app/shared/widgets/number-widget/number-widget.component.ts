import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {AbstractWidget} from '../abstract-widget';

@Component({
	selector: 'app-number-widget',
	templateUrl: './number-widget.component.html',
	styleUrls: ['./number-widget.component.scss', '../widget.scss']
})
export class NumberWidgetComponent extends AbstractWidget implements OnInit {
	@ViewChild('numberInput', {static: true}) input!: ElementRef;

	private lastValidValue = '0';
	
	setSettings(key: string, event: any) {
		

		let value = event.target.value;
		
		if (event.data) {
			if (event.data.length > value.length) {
				// input property sets
				// the value to "" when it
				// has an invalid input
				value = this.lastValidValue;	
			}
		}

		// Number converts "" to 0
		// while parseFloat converts "" to NaN
		const num = Number(value);

		this.lastValidValue = num.toString();

		this.input.nativeElement.value = num.toString();

		super.setSetting(key, num);
	}
}
