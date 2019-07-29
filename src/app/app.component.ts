import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {
  Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot
} from '@angular/router';

import {HttpClient, HttpResponse} from '@angular/common/http';
import {NzModalService, NzMessageService, NzNotificationService} from 'ng-zorro-antd';

import {Jc} from '@core/jc';

@Component({
  selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'JcCorePlatform';

  constructor (private http: HttpClient, private router: Router,
               public activatedRoute: ActivatedRoute,
               private titleService: Title, private modal: NzModalService, private msg: NzMessageService, private ntf: NzNotificationService) {
    //初始化Sn
    Jc.onInit(this.http, this.router, this.modal, this.msg, this.ntf, this.titleService);
    //this.checkLogin();
  }

  ngOnInit () {
  }

  /*检查用户是否已登录*/
  checkLogin () {
    if (Jc.token) {
    }
  }
}
