import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GlobalEventsService} from '../../shared/global-events.service';
import {Point} from '../../shared/interfaces/cross-code-map';
import {MdMenuTrigger} from '@angular/material';
import {Vec2} from '../../shared/phaser/vec2';

@Component({
	selector: 'app-add-entity-menu',
	templateUrl: './add-entity-menu.component.html',
	styleUrls: ['./add-entity-menu.component.scss']
})
export class AddEntityMenuComponent implements OnInit {
	@ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
	@ViewChild('filter') filter: ElementRef;

	@Input() pos: Point = {x: 0, y: 0};
	@Input() keys: string[];
	filteredKeys: string[];
	searchInput: string;

	private mousePos: Point = {};

	constructor(private events: GlobalEventsService) {
		document.onmousemove = e => {
			this.mousePos.x = e.pageX + 5;
			this.mousePos.y = e.pageY + 5;
		};
		this.events.showAddEntityMenu.subscribe(val => {
			if (!val.show) {
				this.trigger.closeMenu();
				return;
			}

			Vec2.assign(this.pos, this.mousePos);

			if (!this.keys) {
				this.keys = Object.keys(val.definitions);
			}

			this.searchInput = '';
			this.filteredKeys = this.keys.slice();
			setTimeout(() => {
				this.trigger.openMenu();
				this.filter.nativeElement.focus();
			}, 0);
		});
	}

	ngOnInit() {

	}

	filterKeys(search: string) {
		this.searchInput = search;
		this.filteredKeys = this.keys.filter(key => {
			if (!search) {
				return true;
			}
			return key.toLowerCase().includes(search.toLowerCase());
		});
		console.log(this.filteredKeys);
	}
}
