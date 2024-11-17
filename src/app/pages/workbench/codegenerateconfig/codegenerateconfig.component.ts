import { Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api.service';
import { ActivatedRoute } from '@angular/router';
import { PageType, TsModel } from '@models/tsmodel';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { TsPi } from '@models/propertyinfo';
import { CodeCreator } from '@core/PageHelper/codecreator';
import { PiDisplayConfigComponent } from '../pidisplayconfig/pidisplayconfig.component';

@Component({
  selector: 'app-codegenerateconfig',
  templateUrl: './codegenerateconfig.component.html',
  styleUrls: ['./codegenerateconfig.component.less'],
})
export class CodeGenerateConfigComponent implements OnInit {
  config: TsModel = new TsModel();

  constructor(
    private route: ActivatedRoute,
    private modalSvc: NzModalService,
    private modal: NzModalRef
  ) {}

  ngOnInit() {
    this.config = this.modal.getConfig().nzData.configModel as TsModel;
    this.checkPiDisplayTypeList(this.config);
  }

  // 设置显示类型列表
  checkPiDisplayTypeList(config: TsModel) {
    if (!config.editPageType) {
      config.editPageType = PageType.Page;
    }
    if (!config.detailPageType) {
      config.detailPageType = PageType.Page;
    }
    config.piList.forEach(pi => {
      this.checkPiDisplayType(pi);
    });
  }

  /**
   * 检查并更新PI（页面元素）的显示类型
   */
  checkPiDisplayType(pi: TsPi) {
    let queryDisplayTypeList = CodeCreator.getPiQueryDisplayTypeList(pi);
    let listDisplayTypeList = CodeCreator.getPiListDisplayTypeList(pi);
    let editDisplayTypeList = CodeCreator.getPiEditDisplayTypeList(pi);
    let detailDisplayTypeList = CodeCreator.getPiDetailDisplayTypeList(pi);

    if (!pi.queryDisplayType || queryDisplayTypeList.filter((a) => a == pi.queryDisplayType).length == 0) {
      pi.queryDisplayType = CodeCreator.getPiQueryDisplayType(pi);
    }
    if (!pi.listDisplayType || listDisplayTypeList.filter((a) => a == pi.listDisplayType).length == 0) {
      pi.listDisplayType = CodeCreator.getPiListDisplayType(pi);
      pi.isListSort = true;
    }
    if (!pi.editDisplayType || editDisplayTypeList.filter((a) => a == pi.editDisplayType).length == 0) {
      pi.editDisplayType = CodeCreator.getPiEditDisplayType(pi);
      pi.isRequire = true;
    }
    if (!pi.detailDisplayType || detailDisplayTypeList.filter((a) => a == pi.detailDisplayType).length == 0) {
      pi.detailDisplayType = CodeCreator.getPiDetailDisplayType(pi);
    }
  }

  // 设置显示类型列表
  setDisplayType(pi: TsPi, display: string = 'query') {
    const modal: NzModalRef = this.modalSvc.create({
      nzTitle: 'Set DisplayType',
      nzWidth: 320,
      nzContent: PiDisplayConfigComponent,
      nzData: { pi: pi, display: display },
      nzCentered: true,
      nzMaskClosable: false,
      nzNoAnimation: true,
      nzFooter: null,
      nzOkText: null,
      nzCancelText: null,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
      }
    });
  }

  /*生成*/
  generate(): void {
    this.modal.close(true);
  }

  /*返回*/
  cancel(): void {
    this.modal.close(false);
  }
}
