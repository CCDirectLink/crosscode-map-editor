import { EventWidgetComponent } from '../../../../components/widgets/event-widget/event-widget.component';
import { DefaultEntity } from './default-entity';

export class EventTrigger extends DefaultEntity {
	
	public override doubleClick(): void {
		(this.widgets['event'] as EventWidgetComponent).open();
	}
}
