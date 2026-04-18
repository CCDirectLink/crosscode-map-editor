import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractWidget } from '../abstract-widget';
import { InputWithButtonComponent } from '../inputs/input-with-button/input-with-button.component';
import { MapLoaderService } from '../../../services/map-loader.service';

interface MapsSettings {
	[key: string]: string | undefined;
}

@Component({
	selector: 'app-maps-widget',
	templateUrl: './maps-widget.component.html',
	styleUrls: ['./maps-widget.component.scss', '../widget.scss'],
	imports: [InputWithButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsWidgetComponent extends AbstractWidget<MapsSettings> {
	
	private mapLoader = inject(MapLoaderService);
	
	async loadMap() {
		const map = this.settings?.[this.key];
		if (!map) {
			return;
		}
		await this.mapLoader.loadMapByName(map, true);
	}
}
