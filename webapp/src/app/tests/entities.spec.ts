import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateHistoryService } from '../components/dialogs/floating-window/history/state-history.service';
import { PhaserComponent } from '../components/phaser/phaser.component';
import { CrossCodeMap, MapEntity } from '../models/cross-code-map';
import { AutotileService } from '../services/autotile/autotile.service';
import { HeightMapService } from '../services/height-map/height-map.service';
import { MapLoaderService } from '../services/map-loader.service';
import { TestHelper } from './test-helper';
import testMap from '../../../../test-maps/test-scale-prop.json';

class SimpleServiceMock {
	init() {
	}
}

describe('Entities', () => {
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
	
	afterEach(() => vi.restoreAllMocks());
	
	it('make new npc and export map', async () => {
		const service: MapLoaderService = TestBed.inject(MapLoaderService);
		const res = await TestHelper.loadMap(service, testMap);
		const map = res.ccmap;
		const exported1 = map.exportMap();
		
		const npc = makeNewNpc();
		const e = await map.entityManager.generateNewEntity(npc);
		expect(e).toBeDefined();
		const exported2 = map.exportMap();
		
		expect(exported2.entities.length - exported1.entities.length, 'exported map should have 1 additional entity').toBe(1);
	});
	
	
	it('entities should have a unique mapId (instanceof Number)', async () => {
		const service: MapLoaderService = TestBed.inject(MapLoaderService);
		const res = await TestHelper.loadMap(service, testMap);
		const map = res.ccmap;
		
		await map.entityManager.generateNewEntity(makeNewNpc());
		await map.entityManager.generateNewEntity(makeNewNpc());
		await map.entityManager.generateNewEntity(makeNewNpc());
		const exported = map.exportMap();
		checkMapId(exported);
	});
	
	it('copy paste entity', async () => {
		let clipboard = '';
		vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(async text => {
			clipboard = text;
		});
		vi.spyOn(navigator.clipboard, 'readText').mockImplementation(async () => clipboard);
		
		const service: MapLoaderService = TestBed.inject(MapLoaderService);
		const res = await TestHelper.loadMap(service, testMap);
		const map = res.ccmap;
		
		map.entityManager.setActive(true);
		
		const entity = await map.entityManager.generateNewEntity(makeNewNpc());
		const exported1 = map.exportMap();
		
		map.entityManager.selectEntity(entity, false);
		await map.entityManager.copy();
		await map.entityManager.paste();
		
		const exported2 = map.exportMap();
		
		expect(exported2.entities.length - exported1.entities.length, 'copy paste should add 1 entity').toBe(1);
		checkMapId(exported2);
	});
	
});

function makeNewNpc() {
	const npc: MapEntity = {
		x: 123,
		y: 221,
		type: 'NPC',
		level: 0,
		settings: {}
	};
	return npc;
}

function checkMapId(exported: CrossCodeMap) {
	const ids = exported.entities.map(e => e.settings.mapId);
	ids.sort((a, b) => (a ?? -9) - (b ?? -9));
	console.log(ids);
	for (const id of ids) {
		expect(id).toBeTypeOf('number');
	}
	
	expect(new Set(ids).size, 'mapId should be unique for every entity').toBe(exported.entities.length);
}
