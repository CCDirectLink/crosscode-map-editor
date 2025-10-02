import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-input-with-button',
	imports: [CommonModule, MatTooltipModule, FormsModule, MatButtonModule, MatIconModule],
	templateUrl: './input-with-button.component.html',
	styleUrls: ['./input-with-button.component.scss', '../../widget.scss']
})
export class InputWithButtonComponent {
	@Input() description?: string;
	@Input() key = '';
	@Input() model?: string;
	@Output() modelChange = new EventEmitter<string>();
	@Output() buttonClick = new EventEmitter<void>();
}
