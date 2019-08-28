import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-httptool',
  templateUrl: './httptool.component.html',
  styleUrls: ['./httptool.component.less']
})
export class HttpToolComponent implements OnInit {
  method:string = 'Get';
  ecode:string = 'UTF-8';
  contentType:string = 'application/json';
  constructor() { }

  ngOnInit() {
  }

}
