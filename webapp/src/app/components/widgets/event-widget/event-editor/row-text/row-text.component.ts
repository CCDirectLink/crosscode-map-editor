import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { EventDisplay } from '../event-display.model';
import { NgClass } from '@angular/common';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { MatIcon } from '@angular/material/icon';
import { KeepHtmlPipe } from '../../../../../pipes/keep-html.pipe';

@Component({
    selector: 'app-row-text',
    templateUrl: './row-text.component.html',
    styleUrls: ['./row-text.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, ExtendedModule, MatIcon, KeepHtmlPipe]
})
export class RowTextComponent implements OnInit {
	private ref = inject(ChangeDetectorRef);

	@Input() display!: EventDisplay;
	
	ngOnInit(): void {
		this.display.changeDetector = this.ref;
	}
}
