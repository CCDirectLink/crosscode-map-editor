import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';
import { Helper } from '../../../../services/phaser/helper';
import { RandomDistributionOption } from '../../random-distribution-widget/random-distribution-widget.component';
import { AbstractEvent, EventType } from './abstract-event';

export interface SelectRandomData extends EventType {
	[key: `${number}_${number}`]: AbstractEvent<any>[];
    
    options: RandomDistributionOption[];
}

export class SelectRandom extends AbstractEvent<SelectRandomData> {
	private attributes: EntityAttributes = {
        options: {
            type: 'RandomDistribution',
            description: 'Defines the possible branches for this event, as well as their chances.',
            noLabel: true,
        }
	};

	getAttributes() {
		return this.attributes;
	}

	update() {
		this.children = [];
		this.info = this.getTypeString('#ffffff');

        this.data.options?.forEach((option, optionIndex) => {
            for (let branch = 0; branch < option.count; branch++) {
                const key = optionIndex  + '_' + branch as `${number}_${number}`;
                this.children.push({
                    title: this.combineStrings(
                        this.getPropString('Entry', optionIndex + ' #' + branch),
                        this.getPropString('weight', option.weight),
                        (option.activeCondition ? this.getPropString('activeCondition', option.activeCondition) : '')),
                    events: this.data[key] || [],
                    key,
                    draggable: false,
                });
            }
        });
	}
	
	
	override export(): SelectRandomData {
		const out: SelectRandomData = {
			type: this.data.type,
			options: this.data.options,
		};
        for (const child of this.children) {
			out[child.key as `${number}_${number}`] = child.events?.map(v => v.export()) ?? [];
        }
		
		return Helper.copy(out);
	}

	protected override generateNewDataInternal(): SelectRandomData {
		return {
            type: 'SELECT_RANDOM',
			options: [{
                count: 2,
                weight: 1,
			}]
		};
	}
}