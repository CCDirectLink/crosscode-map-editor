import {Routes} from '@angular/router';
import {EditorComponent} from './components/editor/editor.component';
import {BabylonComponent} from './components/babylon/babylon.component';
import {HistoryComponent} from './shared/history/history.component';

export const routes: Routes = [
	{
		path: '',
		component: EditorComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: ''
			},
			{
				path: '3d',
				component: BabylonComponent
			}
		]
	}
];
