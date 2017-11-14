import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HistoryState, StateHistoryService} from './state-history.service';

@Component({
	selector: 'app-history',
	templateUrl: './history.component.html',
	styleUrls: ['./history.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class HistoryComponent implements OnInit {
	
	@ViewChild('listContainer') list: ElementRef;
	
	states: HistoryState[] = [];
	selected;
	selectedIndex;
	
	constructor(private stateHistory: StateHistoryService) {
		stateHistory.states.subscribe(states => {
			this.states = states;
			this.updateSelected(this.selected);
			if (!this.list) {
				return;
			}
			setTimeout(() => {
				const el = this.list.nativeElement;
				console.log(el);
				el.scrollTop = el.scrollHeight * 2;
			}, 0);
		});
		stateHistory.selectedState.subscribe(container => {
			this.updateSelected(container);
		});
	}
	
	ngOnInit() {
	}
	
	updateSelected(container) {
		if (!container) {
			return;
		}
		this.selected = container;
		this.selectedIndex = this.states.indexOf(container.state);
	}
	
	create() {
		this.stateHistory.saveState({
			state: <any>{name: Math.random()},
			name: '' + Math.random().toFixed(7),
			icon: 'house'
		});
	}
	
	undo() {
		this.stateHistory.undo();
	}
	
	redo() {
		this.stateHistory.redo();
	}
	
	selectState(state) {
		this.stateHistory.selectedState.next({state: state});
	}
	
}
