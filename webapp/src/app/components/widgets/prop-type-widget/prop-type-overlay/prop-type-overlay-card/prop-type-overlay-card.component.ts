import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-prop-type-overlay-card',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './prop-type-overlay-card.component.html',
	styleUrls: ['./prop-type-overlay-card.component.scss']
})
export class PropTypeOverlayCardComponent {
	@Input() name = '?';
	@Input() selected = false;
	@Input() img?: string;
	
	@Output() onClick = new EventEmitter<MouseEvent>();
}
