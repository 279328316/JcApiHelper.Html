import { Component } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError
} from "@angular/router";
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: "layout-default",
  templateUrl: "./default.component.html",
  styleUrls: ['./default.component.less']
})
export class LayoutDefaultComponent {

  constructor(
    router: Router,
    private _message: NzMessageService
  ) {
    router.events.subscribe(evt => {
      if (evt instanceof NavigationError) {
        _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
        return;
      }
    });
  }
}
