import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppModule } from '../app.module';

import { StateHistoryService } from '../components/dialogs/floating-window/history/state-history.service';
import { LayersComponent } from '../components/layers/layers.component';
import { PhaserComponent } from '../components/phaser/phaser.component';
import { MaterialModule } from '../external-modules/material.module';
import { AutotileService } from '../services/autotile/autotile.service';
import { HeightMapService } from '../services/height-map/height-map.service';
import { HttpClientService } from '../services/http-client.service';
import { MapLoaderService } from '../services/map-loader.service';
import { TestHelper } from './test-helper';

class SimpleServiceMock {
	init() {
	}
}

describe('Layers', () => {
	let component: PhaserComponent;
	let fixture: ComponentFixture<PhaserComponent>;
	
	beforeEach(() => TestBed.configureTestingModule({
		declarations: [PhaserComponent, LayersComponent],
		imports: [NoopAnimationsModule, AppModule, HttpClientModule, MaterialModule],
		providers: [
			{provide: AutotileService, useValue: new SimpleServiceMock()},
			{provide: HeightMapService, useValue: new SimpleServiceMock()},
			
			StateHistoryService
		]
	}).compileComponents());
	
	beforeEach(() => {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	});
	
	beforeEach(() => {
		fixture = TestBed.createComponent(PhaserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	
	it('add new layer with all tiles index 0', async () => {
		const fixture = TestBed.createComponent(LayersComponent);
		const comp = fixture.componentInstance;
		fixture.detectChanges();
		
		const service: MapLoaderService = TestBed.get(MapLoaderService);
		const http: HttpClientService = TestBed.get(HttpClientService);
		const res = await TestHelper.loadMap(service, http, 'autumn/entrance');
		const map = res.ccmap;
		const export1 = map.exportMap();
		
		await comp.addNewLayer();
		
		const export2 = map.exportMap();
		const data = export2.layer[export2.layer.length - 1].data;
		
		expect(export2.layer.length - export1.layer.length).toBe(1, 'should add new layer');
		
		const ids = new Set(data.flat());
		console.log(Array.from(ids));
		expect(ids.size).toBe(1);
		expect(ids.values().next().value).toBe(0, 'should initialize all tiles with 0');
		
	});
	
});
