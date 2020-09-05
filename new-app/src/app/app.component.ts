import { Component, OnInit } from '@angular/core';
import { ColorEvent } from 'ngx-color';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  rgb_obj: {r:number,g:number,b:number,a:number};
  messageText: string;
  messages: Array<any>;
  color_rgb: string;
  socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect('http://192.168.0.130:8000');
  }
  
  handleChange($event: ColorEvent) {
    this.rgb_obj = $event.color.rgb;
    this.color_rgb = JSON.stringify($event.color.rgb);
    this.socket.emit('event1', {
      msg: this.color_rgb
    });
  }

  ngOnInit() {
    this.socket.on('event2', (data: any) => {
      this.rgb_obj = data.msg;
    });
  }

  title = 'new-app';
}


