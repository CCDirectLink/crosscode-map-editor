import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from './shared/modal.directive';
import {ModalService} from './services/modal.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	@ViewChild(ModalDirective) modalHost: ModalDirective;
	
	constructor(private modalService: ModalService) {
	
	}
	
	ngOnInit() {
		this.modalService.modalHost = this.modalHost;
	}
}
