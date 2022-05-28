import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Globals } from '../../shared/globals';

@Component({
	selector: 'app-captions',
	templateUrl: './captions.component.html',
	styleUrls: ['./captions.component.scss'],
})
export class CaptionsComponent implements OnInit {
	version = environment.version;
	coords = '';
	coordsClass = 'inactive';

	ngOnInit(): void {
		Globals.globalEventsService.updateCoords.subscribe((coords) => {
			this.coords = !coords
				? ''
				: `(${coords.x}, ${coords.y}, ${coords.z})`;

			this.coordsClass = coords ? '' : 'inactive';
		});
	}
}
