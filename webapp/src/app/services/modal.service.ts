import {Injectable} from '@angular/core';
import {ModalDirective} from '../shared/modal.directive';

@Injectable()
export class ModalService {
	public modalHost: ModalDirective;
}
