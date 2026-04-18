import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-input-with-button',
	imports: [MatTooltipModule, FormsModule, MatButtonModule, MatIconModule],
	templateUrl: './input-with-button.component.html',
	styleUrls: ['./input-with-button.component.scss', '../../widget.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputWithButtonComponent {
	readonly description = input<string>();
	readonly key = input('');
	readonly val = model<string>();
	readonly buttonClick = output<void>();
}
