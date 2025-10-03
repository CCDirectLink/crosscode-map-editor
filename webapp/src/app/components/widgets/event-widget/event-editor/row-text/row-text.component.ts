import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnInit,
	inject,
} from '@angular/core';
import { EventDisplay } from '../event-display.model';

@Component({
	selector: 'app-row-text',
	templateUrl: './row-text.component.html',
	styleUrls: ['./row-text.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: false,
})
export class RowTextComponent implements OnInit {
	private ref = inject(ChangeDetectorRef);

	@Input() display!: EventDisplay;

	ngOnInit(): void {
		this.display.changeDetector = this.ref;
	}
}
