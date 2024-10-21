import {Component, OnInit} from '@angular/core';
import { DateHelper } from '@core/datehelper';
import {Util} from '@core/util';

@Component({
  selector: 'app-websockettool',
  templateUrl: './websockettool.component.html',
  styleUrls: ['./websockettool.component.less']
})
export class WebSocketToolComponent implements OnInit {
  serverUrl = 'ws://127.0.0.1:7900';
  displayMsg = '';
  msg = '';
  ws: WebSocket;
  wsStatus = false;
  connecting = false;
  autoClear = false;

  constructor() {
  }

  ngOnInit(): void {
    if (typeof (WebSocket) === 'undefined') {
      this.showMsg('您的浏览器不支持WebSocket');
    }
  }

  connect() {
    if (this.connecting) {
      return;
    }
    this.displayMsg = '';
    if (!this.serverUrl) {
      Util.showInfoBox('WebSocket Address 不能为空.');
      return;
    }
    try {
      this.connecting = true;
      let _this = this;
      this.showMsg('正在尝试连接到:' + this.serverUrl);
      this.ws = new WebSocket(this.serverUrl);
      this.ws.onopen = function () {
        _this.wsStatus = true;
        _this.connecting = false;
        _this.showMsg('连接成功,可以发送消息了.');
      };
      // 接收消息事件
      this.ws.onmessage = function (msg) {
        _this.showMsg('Server:  ' + msg.data);
      };
      // 发生了错误事件
      this.ws.onerror = function (error) {
        console.log(error);
      };
      // 关闭事件
      this.ws.onclose = function (e) {
        _this.showMsg('连接已关闭.');
        _this.wsStatus = false;
        _this.connecting = false; //无法连接时
      };
    }
    catch (error) {
      this.showMsg('连接异常:' + error);
      this.connecting = false;
    }
  }

  // 关闭webSocket
  disconnect() {
    this.ws.close(); // 主动关闭
  }

  // 显示Msg
  showMsg(msg: string) {
    this.displayMsg += DateHelper.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss') + ' ' + msg + '\n';
  }

  // 发送Msg
  sendMsg() {
    if (!this.msg) {
      Util.showInfoBox('发送消息不能为空');
      return;
    }
    if (this.wsStatus) {
      try {
        this.ws.send(this.msg);
        this.showMsg('Client :  ' + this.msg);
        if (this.autoClear) {
          this.msg = '';
        }
      }
      catch (e) {
        Util.showInfoBox('消息发送失败:' + e);
      }
    } else {
      Util.showInfoBox('WebSocket尚未连接');
    }
  }

  // Clear Msg
  clear() {
    this.displayMsg = '';
  }

  // 关闭webSocket
  disConnect() {
    this.ws.close(); // 主动关闭
  }
}
