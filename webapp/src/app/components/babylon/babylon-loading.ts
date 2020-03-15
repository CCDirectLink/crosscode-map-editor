import {CCMap} from '../../shared/phaser/tilemap/cc-map';

export class BabylonLoading {
	
	private max = 0;
	private curr = 0;
	
	private layerWorth = 100;
	private entityWorth = 1;
	
	init(map: CCMap) {
		this.curr = 0;
		this.max = this.layerWorth;
		for (const layer of map.layers) {
			if (layer.details.type.toLowerCase() === 'collision') {
				this.max += this.layerWorth;
			}
		}
		// this.max += map.entityManager.entities.length * this.entityWorth;
		
		return this.max;
	}
	
	addLayer() {
		return this.add(this.layerWorth);
	}
	
	addEntity() {
		return this.add(this.entityWorth);
	}
	
	private add(val: number) {
		this.curr += val;
		
		return this.curr / this.max;
	}
	
	
}
