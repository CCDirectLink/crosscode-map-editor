import { Component } from '@angular/core';
import { AbstractWidget } from '../abstract-widget';

@Component({
	selector: 'app-boolean-widget',
	templateUrl: './boolean-widget.component.html',
	styleUrls: ['./boolean-widget.component.scss', '../widget.scss']
})
export class BooleanWidgetComponent extends AbstractWidget {
}
