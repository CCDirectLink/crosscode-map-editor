import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FlexModule } from '@angular/flex-layout/flex';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { ExtendedModule } from '@angular/flex-layout/extended';

/**
 * Used to display an overlay with the basic styles (draggable toolbar, scrollable content and buttons at the bottom)
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FlexModule, CdkDrag, CdkDragHandle, NgClass, ExtendedModule]
})
export class OverlayPanelComponent {
	
	@Input() title = '';
	@Input() allowDrag = true;
	@Input() customSize?: { width?: string, height?: string };
	@Input() left?: string;
	@Input() top?: string;
	@Input() showButtonDivider = false;
	
	classes: { [key: string]: boolean } = {};
	
	constructor() {
	}
	
}
