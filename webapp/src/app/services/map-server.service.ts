import { Injectable , HostListener  } from '@angular/core';
import {Globals} from '../shared/globals';
@Injectable({
  providedIn: 'root'
})

export class MapServerService {
  private server = null;
  private ws;
  constructor() { 
    if (Globals.isElectron) {
      // @ts-ignore
      let remote = window.require('electron').remote;
      this.ws = remote.require('ws');

      // when a live reload is about to happen
      // this is called... (cleans up server and frees port)
      remote.getCurrentWebContents().on('will-navigate', () => {
        this.close();
      });
      this.server = new this.ws.Server({port : 8000 });
    }
  }
  isAvailable() {
    return this.server !== null;
  }
  sendToCrossCode(data) {
    if(this.isAvailable()) {
      this.server.clients.forEach((clientSocket) => {
          // console.log(clientSocket);
          clientSocket.send(JSON.stringify(data));
      });
    }

  }
  close() {
    console.debug('Closing map server...');
    if(this.isAvailable()) {
      this.server.close();
    }
    console.debug('Done closing map server');
  }
}
