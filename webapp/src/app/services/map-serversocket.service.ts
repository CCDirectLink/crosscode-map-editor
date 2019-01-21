import { Injectable , HostListener  } from '@angular/core';
import {Globals} from '../shared/globals';

@Injectable({
  providedIn: 'root'
})

export class MapServerSocketService {
  private server = null;
  private socket = null;
  private readonly WEBSOCKET_ADDR = 'ws://localhost:8000';
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

      let url = remote.getCurrentWebContents().getURL();

      // safe to create server
      // TODO: find a better way to check if 
      // port is open 
      // (this will fail if some other program is using it)
      if (url.indexOf("localhost") === -1) {
        this.server = new this.ws.Server({port : 8000 });
      }
      
    }

    if (this.server === null) {
      this.socket = new WebSocket(this.WEBSOCKET_ADDR);
    }
  }
  isAvailable() {
    return  this.isAvailableServer() || this.isAvailableSocket();
  }
  isAvailableServer() {
    return this.server !== null;
  }

  isAvailableSocket() {
    return this.socket !== null;
  }
  sendToCrossCode(data) {
    if(this.isAvailableServer()) {
    
      this.server.clients.forEach((clientSocket) => {

          clientSocket.send(JSON.stringify(data));
      });
    
    } else if(this.isAvailableSocket()) {

      this.socket.send(JSON.stringify(data));
    
    }

  }
  close() {
    if(this.isAvailableServer()) {
      console.debug('Closing map server...');
      this.server.close();
      console.debug('Done closing map server');
    }
  }
}
