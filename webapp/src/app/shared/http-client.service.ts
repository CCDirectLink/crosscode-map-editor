import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Globals} from './globals';

declare let nw: any;
declare let chrome: any;

@Injectable()
export class HttpClientService {
	
	private fs;
	private path;
	private config;
	private isClicked = false;
	
	constructor(private http: HttpClient) {
		if (Globals.isNwjs) {
			this.fs = requireNode('fs');
			this.path = requireNode('path');
			try {
				this.config = JSON.parse(this.fs.readFileSync(this.path.join(nw.App.dataPath, 'config.json')));
				Globals.URL = 'file:///' + this.config.pathToCrosscode;
			} catch (e) {
				this.selectCcFolder();
			}
		}
	}
	
	getAllFiles(): Observable<Object> {
		if (!Globals.isNwjs) {
			return this.http.get(Globals.URL + 'api/allFiles');
		}
		return new Observable(obs => {
			try {
				const o = {
					images: this.listAllFiles(this.config.pathToCrosscode + 'media/', [], 'png'),
					data: this.listAllFiles(this.config.pathToCrosscode + 'data/', [], 'json')
				};
				
				obs.next(o);
				obs.complete();
			} catch (e) {
				console.error(e);
				this.selectCcFolder();
			}
		});
	}
	
	private selectCcFolder() {
		if (this.isClicked) {
			return;
		}
		const fs = this.fs;
		const path = this.path;
		const dirInput = document.getElementById('inputDirectory');
		
		dirInput.addEventListener('change', function (evt) {
			const ccPath: string = (<any>this).value + '\\';
			fs.writeFileSync(path.join(nw.App.dataPath, 'config.json'), JSON.stringify({pathToCrosscode: ccPath}, null, 2));
			console.log(nw.App.dataPath);
			chrome.runtime.reload();
		}, false);
		
		dirInput.click();
		this.isClicked = true;
	}
	
	private listAllFiles(dir: string, filelist, ending: string): string[] {
		const files = this.fs.readdirSync(dir);
		const that = this;
		filelist = filelist || [];
		files.forEach(function (file) {
			if (that.fs.statSync(dir + file).isDirectory()) {
				filelist = that.listAllFiles(dir + file + '/', filelist, ending);
			} else if (!ending || file.toLowerCase().endsWith(ending.toLowerCase())) {
				filelist.push((dir + file).split(that.config.pathToCrosscode)[1]);
			}
		});
		return filelist;
		
	}
}
