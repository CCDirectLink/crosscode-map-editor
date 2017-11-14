import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {CrossCodeMap} from '../shared/interfaces/cross-code-map';
import {Observable} from 'rxjs/Observable';

export interface HistoryState {
	icon: string;
	name: string;
	state: CrossCodeMap;
}

@Injectable()
export class StateHistoryService {
	maxStates = 100;
	
	states: BehaviorSubject<HistoryState[]> = new BehaviorSubject([]);
	selectedState: BehaviorSubject<{ state: HistoryState }> = new BehaviorSubject({state: null});
	
	constructor() {
	}
	
	init(state: HistoryState) {
		this.selectedState.value.state = state;
		this.states.next([state]);
	}
	
	saveState(state: HistoryState) {
		const states = this.states.getValue();
		const selected = this.selectedState.getValue();
		const i = states.indexOf(selected.state);
		selected.state = state;
		states.length = i + 1;
		if (states.length >= this.maxStates) {
			states.shift();
		}
		states.push(state);
		this.states.next(states);
	}
	
	undo() {
		const states = this.states.getValue();
		const selected = this.selectedState.getValue();
		let i = states.indexOf(selected.state);
		if (i <= 0) {
			return;
		}
		i--;
		this.selectedState.next({state: states[i]});
	}
	
	redo() {
		const states = this.states.getValue();
		const selected = this.selectedState.getValue();
		let i = states.indexOf(selected.state);
		if (i === states.length - 1) {
			return;
		}
		i++;
		this.selectedState.next({state: states[i]});
	}
}
