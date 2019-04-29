import {Component, Input, OnInit, ChangeDetectorRef,AfterViewInit, OnChanges} from '@angular/core';
import {AbstractEvent} from '../../event-registry/abstract-event';
import {RowTextComponent} from '../row-text/row-text.component';
@Component({
	selector: 'app-event-row',
	templateUrl: './event-row.component.html',
	styleUrls: ['./event-row.component.scss']
})
export class EventRowComponent implements OnChanges,AfterViewInit {
	@Input() data: AbstractEvent<any>;
	@Input() parent: AbstractEvent<any>;
	@Input() sub: boolean;
	@Input() placeHolder: boolean;
	private childrenComponents: any = [];
	private _parent;
	private placeHolderComponentStartIndex = 0;
	@Input() set parentElement(value) {
		
		if(value === null) {
			value = this;
		}
		this._parent = value;
	}

	get parentElement(): any {
		return this._parent;
	}

	get self() {
		return this;
	}
	constructor(private cdr: ChangeDetectorRef) {
		console.log("Creating!");
	}

	ngOnChanges() {
		console.log("Changes happened!");
	}
	ngAfterViewInit(): void {
		console.log("Initialized view");
		this.detectChanges();
	}
	addComponent(component, index = -1) {
		if (component.isPlaceHolder()) {
			this.childrenComponents.push(component);
		} else {
			if(index === -1) {
				index = this.placeHolderComponentStartIndex;
			}
			this.childrenComponents.splice(index, 0, component);
			this.placeHolderComponentStartIndex += 1;
		}
	}
	removeComponent(component, detectChange = true) {

		if(!component.isPlaceHolder()) {
			let compIndex = this.getChildComponentIndex(component);
			if(compIndex > -1) {
				this.childrenComponents.splice(compIndex, 1);
				component.delete();
				this.placeHolderComponentStartIndex -= 1;
			}
		}
		if(detectChange) {
			this.detectChanges();
		}
	}
	detectChanges() {
		this.cdr.detectChanges();
	}
	removeAllComponents(componentArr) {
		componentArr.forEach((component) => {
			this.removeComponent(component, false);
		});
		this.placeHolderComponentStartIndex -= 1;
		this.detectChanges();
	}
	getData() {
		if(Array.isArray(this.data)) {
			return this.data;
		}
		return this.data || this.parent;
	}
	getChildComponentIndex(comp) {
		return this.childrenComponents.indexOf(comp);
	}
	getAllComponents() {
		return this.childrenComponents;
	}
	getComponentLength() {
		return this.childrenComponents.length;
	}
}
