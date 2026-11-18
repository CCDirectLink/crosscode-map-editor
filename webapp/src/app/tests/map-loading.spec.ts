import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateHistoryService } from '../components/dialogs/floating-window/history/state-history.service';
import { PhaserComponent } from '../components/phaser/phaser.component';
import { AutotileService } from '../services/autotile/autotile.service';
import { HeightMapService } from '../services/height-map/height-map.service';
import { MapLoaderService } from '../services/map-loader.service';
import { TestHelper } from './test-helper';
import { CrossCodeMap } from '../models/cross-code-map';
import testScaleProp from '../../../../test-maps/test-scale-prop.json';

class SimpleServiceMock {
	init() {
	}
}

// TODO: fix map loading, order of entities does matter
describe('Map Loading', () => {
	let component: PhaserComponent;
	let fixture: ComponentFixture<PhaserComponent>;
	
	beforeEach(() => TestBed.configureTestingModule({
    imports: [PhaserComponent],
    providers: [
        { provide: AutotileService, useValue: new SimpleServiceMock() },
        { provide: HeightMapService, useValue: new SimpleServiceMock() },
        StateHistoryService,
        provideHttpClient(withInterceptorsFromDi())
    ]
}).compileComponents());
	
	beforeEach(() => TestHelper.initAssets());
	
	beforeEach(() => {
		fixture = TestBed.createComponent(PhaserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	
	it('should create phaser component', () => {
		expect(component).toBeTruthy();
	});
	
	it('should export same map as imported (test-scale-prop)', async () => {
		const service: MapLoaderService = TestBed.inject(MapLoaderService);
		const output = await loadMap(service, testScaleProp);
		expect(output.exported).toEqual(output.imported);
	});
});

async function loadMap(service: MapLoaderService, map: CrossCodeMap): Promise<{ imported: any, exported: any }> {
	const res = await TestHelper.loadMap(service, map);
	const exported = res.ccmap.exportMap();
	delete exported.filename;
	return {imported: res.imported, exported: exported};
	
}
