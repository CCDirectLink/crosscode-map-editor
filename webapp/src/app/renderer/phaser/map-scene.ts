import * as Phaser from 'phaser';
import { CrossCodeMap } from '../../models/cross-code-map';
import { CCMap } from './tilemap/cc-map';
import { EntityManager } from './entities/entity-manager';
import { SettingsService } from '../../services/settings.service';
import { LoaderService } from '../../services/loader.service';
import { StateHistoryService } from '../../history/state-history.service';
import { EventService } from '../../services/event.service';

export class MapScene extends Phaser.Scene {
    private readonly map: CCMap;

    public constructor(
        map: CrossCodeMap,

        private readonly settings: SettingsService,
        private readonly eventService: EventService,
    ) {
        super({key: 'map'});

        this.map = new CCMap(map, this, {} as EntityManager, settings, {} as EventService);
    }

    public async loadDefinitions(): Promise<void> {
        await this.map.loadDefinitions();
    }

    public preload(): void {
        for (const image of this.map.images) {
            this.load.image(image, this.settings.URL + image);
        }

		this.load.once('complete', () => this.eventService.loadComplete.next());
    }
}
