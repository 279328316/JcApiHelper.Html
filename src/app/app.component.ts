import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {
  Router, ActivatedRoute
} from '@angular/router';

import {HttpClient} from '@angular/common/http';

import {Util} from '@core/util';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzNotificationService} from "ng-zorro-antd/notification";


@Component({
  selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'JcCorePlatform';

  constructor (private http: HttpClient, private router: Router,
               public activatedRoute: ActivatedRoute,
               private titleService: Title, private modal: NzModalService, private msg: NzMessageService, private ntf: NzNotificationService) {
    //初始化Sn
    Util.onInit(this.http, this.router, this.modal, this.msg, this.ntf, this.titleService);
    //this.checkLogin();
  }

  ngOnInit () {
  }

  /*检查用户是否已登录*/
  checkLogin () {
    if (Util.token) {
    }
  }
}
