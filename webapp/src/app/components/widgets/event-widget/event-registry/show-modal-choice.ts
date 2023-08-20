import { Helper } from '../../../../services/phaser/helper';
import { Label } from '../../../../models/events';
import { EntityAttributes } from '../../../../services/phaser/entities/cc-entity';
import { AbstractEvent, EventType } from './abstract-event';
import { DefaultEvent } from './default-event';

export interface ShowModalChoiceData extends EventType {
    [key: number]: AbstractEvent<any>[];

    text: Label;
    options: {
        label: Label;
    }[];
}

export class ShowModalChoice extends DefaultEvent<ShowModalChoiceData> {
    private attributes: EntityAttributes = {
        text: {
            type: 'LangLabel',
            description: 'Text of modal dialog',
			hs: true
        },
        options: {
            type: 'ModalChoiceOptions',
            description: 'All the options of the modal dialog',
			C2: true
        }
    };

    override update() {
        this.children = [];
		this.info = this.combineStrings(
			this.getTypeString('#7774e8'),
			this.getPropString('text', this.getProcessedText(this.data.text))
		);
		
		this.data.options.forEach((option, index) => {
			this.children[index] = {
				title: this.getColoredString('Choice: ', '#838383') + this.getProcessedText(option.label),
				events: this.data[index] || [],
				draggable: false
			};
		});
    }

    override export(): ShowModalChoiceData {
        const out: ShowModalChoiceData = {
            type: this.data.type,
            text: this.data.text,
            options: this.data.options,
        };
		this.children.forEach((child, index) => {
			if (!child.events) {
				console.error('wtf', this);
			}
			out[index] = child.events.map(v => v.export());
		});
		
		return Helper.copy(out);
    }

    protected override generateNewDataInternal() {
        return {
            text: {},
            options: [{
				label: {
                    en_US: 'Choice 1'
                }
			}, {
				label: {
                    en_US: 'Choice 2'
                }
			}]
        };
    }
}
