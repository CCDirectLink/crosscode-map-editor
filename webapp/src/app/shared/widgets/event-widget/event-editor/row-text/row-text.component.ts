import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventDisplay } from '../event-display.model';

@Component({
	selector: 'app-row-text',
	templateUrl: './row-text.component.html',
	styleUrls: ['./row-text.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowTextComponent implements OnInit {
	@Input() display!: EventDisplay;

	constructor(
		private ref: ChangeDetectorRef,
	) {}

	ngOnInit(): void {
		this.display.changeDetector = this.ref;
	}
}
