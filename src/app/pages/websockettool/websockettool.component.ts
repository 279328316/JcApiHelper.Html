import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-websockettool',
  templateUrl: './websockettool.component.html',
  styleUrls: ['./websockettool.component.less']
})
export class WebsockettoolComponent implements OnInit {
  jsonStr = '';
  formatResult = '';
  lines = '';
  defaultLines = 50;
  line: HTMLElement;

  tsModelList = [];
  tsCode = '';
  showCode = false;

  constructor() { }

  ngOnInit() {
  }

}
