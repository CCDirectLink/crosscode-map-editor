import { Component, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { AbstractWidget } from '../abstract-widget';
import { NumberWidgetComponent } from '../number-widget/number-widget.component';
import { StringWidgetComponent } from '../string-widget/string-widget.component';


interface RandomDistributionSettings {
	[key: string]: RandomDistributionOption[] | undefined;
}


export interface RandomDistributionOption {
    activeCondition?: string;
    count: number;
    weight:  number;
}


@Component({
	selector: 'app-random-distribution-widget',
	imports: [
		FormsModule,
		MatTooltip,
		MatIconButton,
		MatIcon,
		NumberWidgetComponent,
		StringWidgetComponent,
	],
	templateUrl: './random-distribution-widget.component.html',
	styleUrls: ['./random-distribution-widget.component.scss', '../widget.scss']
})
export class RandomDistributionWidgetComponent extends AbstractWidget<RandomDistributionSettings> implements OnChanges {
	remove(index: number) {
		this.settings[this.key]?.splice(index, 1);
		this.update();
	}
	
	add() {
		this.settings[this.key]?.push({
			count: 1,
			weight: 1,
		});
		this.update();
	}
	
	protected update() {
		this.updateType(this.settings[this.key]);
	}
}
