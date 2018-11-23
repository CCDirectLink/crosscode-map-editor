import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AbstractEvent} from '../../event-registry/abstract-event';

@Component({
	selector: 'app-row-text',
	templateUrl: './row-text.component.html',
	styleUrls: ['./row-text.component.scss']
})
export class RowTextComponent {
	@Input() hideGreaterSign = false;
	@Input() text;
	
	click() {
		console.log(this.text);
	}
}
