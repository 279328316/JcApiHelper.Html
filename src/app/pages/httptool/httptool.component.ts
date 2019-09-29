import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-httptool',
  templateUrl: './httptool.component.html',
  styleUrls: ['./httptool.component.less']
})
export class HttpToolComponent implements OnInit {
  method:string = 'Get';
  ecode:string = 'UTF-8';
  showSuper:boolean;
  contentType:string = 'application/json';
  url:string;
  params:string;
  cookie:string;
  header:string;

  constructor(private http:HttpClient) {
    this.cookie = localStorage.getItem('CookieStr');
    this.header = localStorage.getItem('HeaderStr');
  }

  ngOnInit() {
  }

  /*清空所有设置*/
  clear(){
    this.url = '';
    this.params = '';
    this.cookie = '';
    this.header = '';
  }

  submit(){
    if(this.cookie && this.cookie != localStorage.getItem('CookieStr')){
      localStorage.setItem('CookieStr',this.cookie);
    }
    if(this.header && this.header != localStorage.getItem('HeaderStr')){
      localStorage.setItem('HeaderStr',this.header);
    }

  }
}
