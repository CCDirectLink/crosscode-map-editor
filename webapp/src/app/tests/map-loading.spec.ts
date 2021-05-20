import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLoaderService } from '../shared/map-loader.service';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { PhaserComponent } from '../components/phaser/phaser.component';
import { StateHistoryService } from '../shared/history/state-history.service';
import { AutotileService } from '../services/autotile/autotile.service';
import { HeightMapService } from '../services/height-map/height-map.service';
import { HttpClientService } from '../services/http-client.service';
import { TestHelper } from './test-helper';

class SimpleServiceMock {
	init() {
	}
}

// TODO: fix map loading, order of entities doesn't matter
describe('Map Loading', () => {
	let component: PhaserComponent;
	let fixture: ComponentFixture<PhaserComponent>;
	
	beforeEach(() => TestBed.configureTestingModule({
		declarations: [PhaserComponent],
		imports: [SharedModule, HttpClientModule],
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
	
	it('should create phaser component', () => {
		expect(component).toBeTruthy();
	});
	
	it('should export same map as imported (autumn/entrance)', async () => {
		const service: MapLoaderService = TestBed.get(MapLoaderService);
		const http: HttpClientService = TestBed.get(HttpClientService);
		const output = await loadMap(service, http, 'autumn/entrance');
		expect(output.exported).toEqual(output.imported);
	});
	
	it('should export same map as imported (lots of maps)', async () => {
		
		const service: MapLoaderService = TestBed.get(MapLoaderService);
		const http: HttpClientService = TestBed.get(HttpClientService);
		
		const paths = await http.getMaps().toPromise();
		
		const autumn = paths.filter(p => p.startsWith('autumn.')).slice(0, 5);
		const arid = paths.filter(p => p.startsWith('arid.')).slice(0, 5);
		const rhombus = paths.filter(p => p.startsWith('rhombus-sqr.')).slice(0, 5);
		const shock = paths.filter(p => p.startsWith('shock-dng.')).slice(0, 5);
		
		const toTest = [...autumn, ...arid, ...rhombus, ...shock];
		expect(toTest.length).toBeGreaterThan(10);
		for (const mapName of toTest) {
			const output = await loadMap(service, http, mapName);
			expect(output.exported).toEqual(output.imported);
		}
	});
});

async function loadMap(service: MapLoaderService, http: HttpClientService, mapName: string): Promise<{ imported: any, exported: any }> {
	const res = await TestHelper.loadMap(service, http, mapName);
	const exported = res.ccmap.exportMap();
	delete exported.path;
	delete exported.filename;
	return {imported: res.imported, exported: exported};
	
}
