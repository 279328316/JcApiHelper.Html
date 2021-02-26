
import {Component, OnInit} from '@angular/core';

import {Util} from '@core/util';
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
  providers: []
})
export class IndexComponent implements OnInit{
  constructor(public msg: NzMessageService) {
  }

  ngOnInit(): void {
  }

  startWork():void{
    Util.goTo("workbench",{queryParams:{a:1,b:2,c:new Date()}});
  }
}
