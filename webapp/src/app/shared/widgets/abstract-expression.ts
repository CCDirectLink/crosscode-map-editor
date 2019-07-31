
import AbstractWidget from './abstract-widget.js';


export enum AbstractExpressionType {
	value = 1,
	varName = 2,
	indirect = 3
}

export class AbstractExpression extends AbstractWidget {
	type: AbstractExpressionType;


	setType(newType: AbstractExpressionType) {
		this.type = newType;
	}

	setSetting(key: string, value: any) {
		switch (this.type) {
			case AbstractExpressionType.value: {
				super.setSetting(key, value);
			}
			break;
			case AbstractExpressionType.varName: {
				super.setSetting(key, {
					varName: value
				});
			}
			break;
			case AbstractExpressionType.indirect: {
				super.setSetting(key, {
					indirect: value
				});
			}
			break;

		}
	}

}