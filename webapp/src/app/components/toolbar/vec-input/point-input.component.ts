import { Component, ElementRef, HostBinding, Input, OnDestroy, inject } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Point } from '../../../models/cross-code-map';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
	selector: 'app-point-input',
	imports: [
		FormsModule,
		ReactiveFormsModule
	],
	providers: [{provide: MatFormFieldControl, useExisting: PointInputComponent}],
	templateUrl: './point-input.component.html',
	styleUrl: './point-input.component.scss'
})
export class PointInputComponent implements MatFormFieldControl<Point>, OnDestroy, ControlValueAccessor {
	private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	ngControl = inject(NgControl, { optional: true, self: true });

	parts: FormGroup;
	stateChanges = new Subject<void>();
	
	@Input()
	min = 1;
	
	onChange = (_: any) => {
	};
	
	@Input()
	get value(): Point | null {
		return this.parts.value;
	}
	
	set value(point: Point | null) {
		point = point || {x: 1, y: 1};
		this.parts.setValue({...point});
		this.stateChanges.next();
	}
	
	static nextId = 0;
	@HostBinding() id = `point-input-${PointInputComponent.nextId++}`;
	
	readonly placeholder = '';
	
	focused = false;
	touched = false;
	onTouched = () => {
	};
	
	onFocusIn(event: FocusEvent) {
		if (!this.focused) {
			this.focused = true;
			this.stateChanges.next();
		}
	}
	
	onFocusOut(event: FocusEvent) {
		if (!this.elementRef.nativeElement.contains(event.relatedTarget as Element)) {
			this.touched = true;
			this.focused = false;
			this.onTouched();
			this.stateChanges.next();
		}
	}
	
	get empty() {
		const p = this.parts.value as Point;
		return isNaN(p.x) && isNaN(p.y);
	}
	
	@HostBinding('class.floating')
	get shouldLabelFloat() {
		return this.focused || !this.empty;
	}
	
	required = false;
	
	private _disabled = false;
	
	@Input()
	get disabled(): boolean {
		return this._disabled;
	}
	
	set disabled(value: BooleanInput) {
		this._disabled = coerceBooleanProperty(value);
		if (this._disabled) {
			this.parts.disable();
		} else {
			this.parts.enable();
		}
		this.stateChanges.next();
	}
	
	get errorState(): boolean {
		return this.parts.invalid && this.touched;
	}
	
	controlType = 'point-input';
	
	setDescribedByIds(ids: string[]): void {
	}
	
	onContainerClick(event: MouseEvent): void {
		if ((event.target as Element).tagName.toLowerCase() !== 'input') {
			this.elementRef.nativeElement.querySelector('input')?.focus();
		}
	}
	
	constructor() {
		const fb = inject(FormBuilder);

		this.parts = fb.group<Point>({
			x: 0,
			y: 0
		});
		if (this.ngControl != null) {
			this.ngControl.valueAccessor = this;
		}
	}
	
	writeValue(p: Point | null): void {
		this.value = p;
	}
	
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}
	
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
	
	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}
	
	ngOnDestroy() {
		this.stateChanges.complete();
	}
	
	update() {
		this.onChange(this.value);
	}
}
