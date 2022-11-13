import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { StateHistoryService } from '../components/dialogs/floating-window/history/state-history.service';
import { PhaserComponent } from '../components/phaser/phaser.component';
import { CrossCodeMap, MapEntity } from '../models/cross-code-map';
import { AutotileService } from '../services/autotile/autotile.service';
import { HeightMapService } from '../services/height-map/height-map.service';
import { HttpClientService } from '../services/http-client.service';
import { MapLoaderService } from '../services/map-loader.service';
import { TestHelper } from './test-helper';

class SimpleServiceMock {
	init() {
	}
}

describe('Entities', () => {
	let component: PhaserComponent;
	let fixture: ComponentFixture<PhaserComponent>;
	
	beforeEach(() => TestBed.configureTestingModule({
		declarations: [PhaserComponent],
		imports: [AppModule, HttpClientModule],
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
	
	it('make new npc and export map', async () => {
		const service: MapLoaderService = TestBed.get(MapLoaderService);
		const http: HttpClientService = TestBed.get(HttpClientService);
		const res = await TestHelper.loadMap(service, http, 'autumn/entrance');
		const map = res.ccmap;
		const exported1 = map.exportMap();
		
		const npc = makeNewNpc();
		const e = await map.entityManager.generateNewEntity(npc);
		expect(e).toBeDefined();
		const exported2 = map.exportMap();
		
		expect(exported2.entities.length - exported1.entities.length).toBe(1, 'exported map should have 1 additional entity');
	});
	
	
	it('entities should have a unique mapId (instanceof Number)', async () => {
		const service: MapLoaderService = TestBed.get(MapLoaderService);
		const http: HttpClientService = TestBed.get(HttpClientService);
		const res = await TestHelper.loadMap(service, http, 'autumn/entrance');
		const map = res.ccmap;
		
		await map.entityManager.generateNewEntity(makeNewNpc());
		await map.entityManager.generateNewEntity(makeNewNpc());
		await map.entityManager.generateNewEntity(makeNewNpc());
		const exported = map.exportMap();
		checkMapId(exported);
	});
	
	it('copy paste entity', async () => {
		const service: MapLoaderService = TestBed.get(MapLoaderService);
		const http: HttpClientService = TestBed.get(HttpClientService);
		const res = await TestHelper.loadMap(service, http, 'autumn/entrance');
		const map = res.ccmap;
		
		map.entityManager.setActive(true);
		
		const entity = await map.entityManager.generateNewEntity(makeNewNpc());
		const exported1 = map.exportMap();
		
		map.entityManager.selectEntity(entity, false);
		map.entityManager.copy();
		await map.entityManager.paste();
		
		const exported2 = map.exportMap();
		
		expect(exported2.entities.length - exported1.entities.length).toBe(1, 'copy paste should add 1 entity');
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
		expect(id).toBeInstanceOf(Number);
	}
	
	expect(new Set(ids).size).toBe(exported.entities.length, 'mapId should be unique for every entity');
}
