
import {Component, OnInit, OnDestroy, Inject, Optional} from '@angular/core';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';

import {Jc} from '@core/jc';

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
    Jc.goTo("workbench",{queryParams:{a:1,b:2,c:new Date()}});
  }
}
