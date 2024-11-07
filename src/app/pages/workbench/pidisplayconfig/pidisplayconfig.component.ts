import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ActivatedRoute } from '@angular/router';
import { TsModel, TsResult } from '@models/tsmodel';
import { Util } from '@core/util';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DisplayType, TsPi } from '@models/propertyinfo';
import { CodeCreator } from '@core/PageHelper/codecreator';

@Component({
  selector: 'app-pidisplayconfig',
  templateUrl: './pidisplayconfig.component.html',
  styleUrls: ['./pidisplayconfig.component.less'],
})
export class PiDisplayConfigComponent implements OnInit {
  pi: TsPi = new TsPi();
  display: string = 'query'; // 显示类型 query list edit detail

  piDisplayType: DisplayType;
  displayTypeList: DisplayType[] = [];
  isSort: boolean = false;
  isRequire: boolean = false;

  constructor(
    private modalSvc: NzModalService,
    private modal: NzModalRef
  ) {}

  ngOnInit() {
    this.pi = this.modal.getConfig().nzData.pi as TsPi;
    this.display = this.modal.getConfig().nzData.display as string;
    
    if (this.display == 'query') {
      this.displayTypeList = CodeCreator.getPiQueryDisplayTypeList(this.pi);
      this.piDisplayType = this.pi.queryDisplayType ?? CodeCreator.getPiQueryDisplayType(this.pi);
    } else if (this.display == 'list') {
      this.displayTypeList = CodeCreator.getPiListDisplayTypeList(this.pi);
      this.piDisplayType = this.pi.listDisplayType ?? CodeCreator.getPiListDisplayType(this.pi);
      this.isSort = this.pi.isListSort == undefined ? true : this.pi.isListSort;
    } else if (this.display == 'edit') {
      this.displayTypeList = CodeCreator.getPiEditDisplayTypeList(this.pi);
      this.piDisplayType = this.pi.editDisplayType ?? CodeCreator.getPiEditDisplayType(this.pi);
      this.isRequire = this.pi.isRequire == undefined ? true : this.pi.isRequire;
    } else if (this.display == 'detail') {
      this.displayTypeList = CodeCreator.getPiDetailDisplayTypeList(this.pi);
      this.piDisplayType = this.pi.detailDisplayType ?? CodeCreator.getPiDetailDisplayType(this.pi);
    }
  }

  /*生成*/
  save(): void {
    if (this.display == 'query') {
      this.pi.queryDisplayType = this.piDisplayType;
    } else if (this.display == 'list') {
      this.pi.listDisplayType = this.piDisplayType;
      this.pi.isListSort = this.isSort;
    } else if (this.display == 'edit') {
      this.pi.editDisplayType = this.piDisplayType;
      this.pi.isRequire = this.isRequire;
    } else if (this.display == 'detail') {
      this.pi.detailDisplayType = this.piDisplayType;
    }
    this.modal.close(true);
  }

  /*返回*/
  cancel(): void {
    this.modal.close(false);
  }
}
