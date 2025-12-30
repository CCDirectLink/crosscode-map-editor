import { Component, OnInit } from '@angular/core';
import { AbstractWidget } from '../abstract-widget';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-number-widget',
    templateUrl: './number-widget.component.html',
    styleUrls: ['./number-widget.component.scss', '../widget.scss'],
    imports: [FlexModule, MatTooltip, FormsModule]
})
export class NumberWidgetComponent extends AbstractWidget implements OnInit {
	
	override setSetting(key: string, value: string) {
		
		const num = parseFloat(value);
		
		if (isNaN(num)) {
			console.warn(`Input ${value} is not a valid number.`);
			return;
		}
		
		super.setSetting(key, num);
	}
}
