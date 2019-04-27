import { Component, OnInit } from '@angular/core';
import {OverlayRefControl} from '../../overlay/overlay-ref-control';
import {Overlay} from '@angular/cdk/overlay';
import {OverlayService} from '../../overlay/overlay.service';
import {AbstractWidget} from '../abstract-widget';
import {LangLabelComponent} from './lang-label/lang-label.component';

export interface LangLabel {
  en_US: string;
  de_DE: string;
  fr_FR: string;
  zh_CN: string;
  ja_JP: string; 
  ko_KR: string;
}
@Component({
  selector: 'app-lang-label-widget',
  templateUrl: './lang-label-widget.component.html',
  styleUrls: ['./lang-label-widget.component.scss',
              '../widget.scss']
})
export class LangLabelWidgetComponent extends AbstractWidget implements OnInit {
  private ref: OverlayRefControl;
  constructor(private overlayService: OverlayService,
              private overlay: Overlay) { 
                super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
  open() {
    if (this.ref && this.ref.isOpen()) {
			return;
		}
		const obj = this.overlayService.open(LangLabelComponent, {
			positionStrategy: this.overlay.position().global()
				.left('23vw')
				.top('calc(64px + 6vh / 2)'),
			hasBackdrop: true
		});
		
    this.ref = obj.ref;
    console.log("Opening langLabel ref", this);
		obj.instance.langLabel = <LangLabel>this.settings.message;
		obj.instance.exit.subscribe(v => {
			this.ref.close();
			this.settings[this.key] = v;
			this.updateType();
		}, e => this.ref.close());
  }

}
