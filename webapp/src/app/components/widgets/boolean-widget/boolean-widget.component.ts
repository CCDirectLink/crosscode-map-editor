import { Component } from '@angular/core';
import { AbstractWidget } from '../abstract-widget';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
    selector: 'app-boolean-widget',
    templateUrl: './boolean-widget.component.html',
    styleUrls: ['./boolean-widget.component.scss', '../widget.scss'],
    imports: [FlexModule, MatTooltip, MatCheckbox]
})
export class BooleanWidgetComponent extends AbstractWidget {
}
