import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {LangLabel} from '../lang-label-widget.component';
@Component({
  selector: 'app-lang-label',
  templateUrl: './lang-label.component.html',
  styleUrls: ['./lang-label.component.scss', 
              '../../../../components/floating-window/floating-window.component.scss',
              '../../widget.scss']
})
export class LangLabelComponent implements OnInit {
  // https://stackoverflow.com/questions/3191664/list-of-all-locales-and-their-short-codes
  languageIds = [
    "en_US",
    "de_DE",
    "fr_FR",
    "zh_CN",
    "ko_KR",
    "ja_JP"
  ];
  @Input() langLabel: LangLabel = {
    en_US: "",
    de_DE: "",
    fr_FR: "",
    zh_CN: "",
    ko_KR: "",
    ja_JP: ""
  };
  @Output() exit: EventEmitter<LangLabel> = new EventEmitter<LangLabel>();
  constructor() { }

  ngOnInit() {
  }

  input(event) {
    let value = event.target.value;
    let lineArr = value.split("\n");
    if(lineArr.length > 3) {
        lineArr = lineArr.slice(0,3);
        event.target.value = lineArr.join("\n");
        event.preventDefault();
    }
  }
  save() {
		this.exit.emit(this.langLabel);
  }
	
	cancel() {
		this.exit.error('cancel');
	}

}
