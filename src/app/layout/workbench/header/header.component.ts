import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "@pages/workbench/service/api.service";

@Component({
  selector: 'layout-workbenchheader',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class WorkbenchHeaderComponent implements OnInit{
  //apiVersion:string;
  constructor(public apiSvc: ApiService) {
  }

  ngOnInit() {
    this.apiSvc.getApiVersion();
  }
}
