import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Globals} from '../shared/globals';
import {Remote, Dialog} from 'electron';

@Injectable()
export class HttpClientService {
	
	private readonly fileName = 'config.json';
	
	private readonly remote: Remote;
	private readonly fs;
	private readonly path;
	private config: { pathToCrosscode: string };
	private configPath: string;
	private isClicked = false;
	
	constructor(private http: HttpClient) {
		if (Globals.isElectron) {
			// @ts-ignore
			this.remote = window.require('electron').remote;
			this.fs = this.remote.require('fs');
			this.path = this.remote.require('path');
			this.configPath = this.path.join(this.remote.app.getAppPath(), this.fileName);
			
			try {
				this.config = JSON.parse(this.fs.readFileSync(this.configPath));
				let p = this.config.pathToCrosscode;
				if (p.endsWith('\\')) {
					p = p.split('\\').join('/');
				}
				if (!p.endsWith('/')) {
					p += '/';
				}
				Globals.URL = 'file:///' + p;
				this.config.pathToCrosscode = p;
			} catch (e) {
			}
		}
	}
	
	getAllFiles(): Observable<Object> {
		if (!this.fs) {
			return this.http.get(Globals.URL + 'api/allFiles');
		}
		return new Observable(obs => {
			if (this.config && this.config.pathToCrosscode) {
				const o = {
					images: this.listAllFiles(this.path.resolve(this.config.pathToCrosscode, 'media/'), [], 'png'),
					data: this.listAllFiles(this.path.resolve(this.config.pathToCrosscode, 'data/'), [], 'json')
				};
				
				obs.next(o);
				obs.complete();
			} else {
				console.warn('path to crosscode not found, opening file dialog');
				this.selectCcFolder();
			}
		});
	}
	
	private selectCcFolder() {
		
		const dialog: Dialog = this.remote.dialog;
		const newPath = dialog.showOpenDialog({
			title: 'Select CrossCode assets folder',
			defaultPath: 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\CrossCode\\assets',
			properties: ['openDirectory']
		});
		
		this.fs.writeFileSync(this.configPath, JSON.stringify({pathToCrosscode: newPath[0]}, null, 2));
		this.remote.app.relaunch();
		this.remote.app.exit();
	}
	
	private listAllFiles(dir: string, filelist: string[], ending: string): string[] {
		const fs = this.fs;
		const path = this.path;
		const files = fs.readdirSync(dir);
		filelist = filelist || [];
		files.forEach(file => {
			if (fs.statSync(path.resolve(dir, file)).isDirectory()) {
				filelist = this.listAllFiles(path.resolve(dir, file), filelist, ending);
			} else if (!ending || file.toLowerCase().endsWith(ending.toLowerCase())) {
				let normalized = path.resolve(dir, file).split(path.normalize(this.config.pathToCrosscode))[1];
				normalized = normalized.split('\\').join('/');
				if (normalized.startsWith('/')) {
					normalized = normalized.substr(1);
				}
				filelist.push(normalized);
			}
		});
		return filelist;
	}
}
