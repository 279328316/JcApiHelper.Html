import { StringHelper } from '@core/stringhelper';
import { TsModel } from '@models/tsmodel';
import { CodeCreator } from '../../codecreator';

export class ListPageTsCreator {
  // 获取列表页面的component代码
  static getListPageTsCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;

    let code = '';
    let template = ListPageTsCreator.getTsTemplate();

    let expandPropertyCode = '';
    let expandInitCode = '';
    let expandFunctionCode = '';

    let queryPiList = pageBaseModel.piList.filter((pi) => pi.isQuery);
    if (queryPiList.filter((a) => a.isKeyvalueItem).length > 0) {
      let piList = queryPiList.filter((a) => a.isKeyvalueItem);
      for (let pi of piList) {
        let piName = StringHelper.firstToLower(pi.name);
        let piClassName = pi.name;
        expandPropertyCode += `\n  ${piName}s: KeyvalueItem[] = [];`;
        expandFunctionCode += CodeCreator.getKeyvalueItemPiInitCode(pi);
        expandInitCode += `\n    this.init${piClassName}();`;
      }
    } else if (queryPiList.filter((a) => a.isEnum).length > 0) {
      let piList = queryPiList.filter((a) => a.isEnum);
      for (let pi of piList) {
        let piName = StringHelper.firstToLower(pi.name);
        let piClassName = pi.name;
        expandPropertyCode += `\n  ${piName}s: EnumItem[] = [];`;
        expandFunctionCode += CodeCreator.getEnumPiInitCode(pi);
        expandInitCode += `\n    this.init${piClassName}();`;
      }
    }
    expandFunctionCode += CodeCreator.getAddFunctionCode(pageBaseModel);
    expandFunctionCode += CodeCreator.getEditFunctionCode(pageBaseModel);
    expandFunctionCode += CodeCreator.getViewDetailFunctionCode(pageBaseModel);
    code = template
      .replace(/@expandPropertyCode/g, expandPropertyCode)
      .replace(/@expandInitCode/g, expandInitCode)
      .replace(/@expandFunctionCode/g, expandFunctionCode)
      .replace(/@modelName/g, modelName)
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@modelSummary/g, modelSummary);
    return code;
  }

  private static getTsTemplate(): string {
    let template = `import { Component, OnInit } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { Util } from "@core/util";
import { @modelClassName, @modelClassNameQueryObj } from "@models/@modelName";
import { PageResult } from "@models/page";
import { EnumItem } from "@models/enumitem";
import { KeyValueItem } from "@models/keyvalue";
import { @modelClassNameService } from "@services/@modelNameservice";
import { EnumService } from "@services/enumservice";
import { KeyValueItemService } from "@services/keyvalueitemservice";
import { @modelClassNameEditModalComponent } from "../@modelNameeditmodal/@modelNameedit.component";
import { @modelClassNameDetailModalComponent } from "../@modelNamedetailmodal/@modelNamedetailmodal.component";

@Component({
  selector: "@modelName-@modelNamelist",
  templateUrl: "./@modelNamelist.component.html",
  styleUrl: "./@modelNamelist.component.less",
})
export class @modelClassNameListComponent implements OnInit {
  loading = false;
  totalCount: number = 0;
  queryObj: @modelClassNameQueryObj = new @modelClassNameQueryObj();
  @modelNameList: @modelClassName[] = [];  
  @expandPropertyCode

  constructor(
    private modalSvc: NzModalService,
    private enumSvc: EnumService,
    private keyvalueItemSvc: KeyValueItemService,
    private @modelNameSvc: @modelClassNameService
  ) {}

  ngOnInit(): void {
    Util.setTitle("@modelSummary管理");    
    @expandInitCode
    this.query@modelClassNameList();
  }
  
  /**
   * 查询参数变化时的回调函数
   *
   * @param params 查询参数对象
   * @returns 无返回值
   */
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    if (
      this.queryObj.pageSize != pageSize ||
      this.queryObj.pageIndex != pageIndex ||
      this.queryObj.sort != sortField ||
      this.queryObj.order != sortOrder
    ) {
      // 解决界面初始化时,自动触发查询问题,界面修改为单向绑定,只有与queryObj的值对比变化时才重新查询
      this.queryObj.pageSize = pageSize;
      this.queryObj.pageIndex = pageIndex;
      this.queryObj.sort = sortField || null;
      this.queryObj.order = sortOrder ? sortOrder.replace("end", "") : null;
      this.query@modelClassNameList();
    }
  }

  /**
   * 查询@modelSummary列表
   *
   * @param isReload 是否重新加载列表，默认为 false
   */
  query@modelClassNameList(isReload: boolean = false): void {
    this.loading = true;
    if (isReload) {
      this.queryObj.pageIndex = 1;
    }
    this.@modelNameSvc.query@modelClassNameList(this.queryObj).subscribe({
      next: (pgResult: PageResult<@modelClassName>) => {
        this.@modelNameList = pgResult.rows;
        this.totalCount = pgResult.total;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
    });
  }
  @expandFunctionCode

  /*删除@modelSummary*/
  delete@modelClassName(@modelName: @modelClassName): void {
    Util.showConfirmBox("确认要删除@modelSummary" + @modelName.name + "吗?").subscribe((res) => {
      if (res) {
        this.@modelNameSvc.delete@modelClassName(@modelName.id).subscribe(() => {
          this.query@modelClassNameList();
        });
      }
    });
  }
}`;
    return template;
  }
}
