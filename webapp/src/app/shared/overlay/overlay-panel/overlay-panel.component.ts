import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

/**
 * Used to display an overlay with the basic styles (dragable toolbar, scrollable content and buttons at the bottom)
 * example usage:
 * ```html
 * <cc-overlay-panel title="Panel Title">
 *     <ng-container ngProjectAs="toolbar">
 *         custom toolbar
 *     </ng-container>
 *     <ng-container ngProjectAs="content">
 *         content...
 *     </ng-container>
 *     <ng-container ngProjectAs="actions">
 *         <button mat-stroked-button (click)="cancel()">Cancel</button>
 *         <button mat-stroked-button (click)="update()">Update</button>
 *     </ng-container>
 * </cc-overlay-panel>
 * ```
 */
@Component({
	selector: 'cc-overlay-panel',
	templateUrl: './overlay-panel.component.html',
	styleUrls: ['./overlay-panel.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayPanelComponent implements OnInit {
	
	@Input() title = '';
	
	constructor() {
	}
	
	ngOnInit() {
	}
	
}
