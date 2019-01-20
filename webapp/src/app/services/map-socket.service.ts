import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapSocketService {
  private socket = null;
  private serverPath = 'ws://localhost:8000';
  private RECONNECT_TIME_MS = 5000;
  constructor() { 
      this.init();
  }
  init() {
    this.socket = new WebSocket(this.serverPath);
    this.socket.onmessage = function({data}) {
      console.log(arguments);
    }
    let count = 0;
    this.socket.onclose = () => {
      if(count === 0) {
        this.socket = null;
        setTimeout(()  => {
          this.init();
        }, this.RECONNECT_TIME_MS);
        count++;
      }
    };
  }
  sendToCrossCode(data) {
    this.socket.send(JSON.stringify(data));
  }
}
