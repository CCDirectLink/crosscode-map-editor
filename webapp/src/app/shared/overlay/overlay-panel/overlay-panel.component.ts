import {Component, Directive, Input, OnInit} from '@angular/core';


/**
 * Used to display an overlay with the basic styles (dragable toolbar, scrollable content and buttons at the bottom)
 */
@Component({
	selector: 'cc-overlay-panel',
	templateUrl: './overlay-panel.component.html',
	styleUrls: ['./overlay-panel.component.scss']
})
export class OverlayPanelComponent implements OnInit {
	
	@Input() title: string;
	
	constructor() {
	}
	
	ngOnInit() {
	}
	
}
