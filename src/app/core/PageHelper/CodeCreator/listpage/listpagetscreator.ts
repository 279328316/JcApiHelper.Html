import { StringHelper } from "@core/stringhelper";
import { TsModel } from "@models/tsmodel";

export class ListPageTsCreator {
  // 获取列表页面的component代码
  static getListPageTsCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;

    let code = "";
    let template = ListPageTsCreator.getTsTemplate();

    code = template
      .replace(/@modelName/g, modelName)
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@modelSummary/g, modelSummary);
    console.log(code);
    return code;
  }

  private static getTsTemplate(): string {
    let template = `import { Component, OnInit } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { Util } from "@core/util";
import { @modelClassName, @modelClassNameQueryObj } from "@models/@modelNamemanage/@modelName";
import { PageResult } from "@models/page";
import { EnumItem } from "@models/enumitem";
import { KeyValueItem } from "@models/keyvalue";
import { @modelClassNameService } from "@services/@modelNamemanage/@modelNameservice";
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

  constructor(
    private modalSvc: NzModalService,
    private enumSvc: EnumService,
    private keyvalueItemSvc: KeyValueItemService,
    private @modelNameSvc: @modelClassNameService
  ) {}

  ngOnInit(): void {
    Util.setTitle("@modelSummary管理");
    this.query@modelClassNameList();
  }

  /**
   * 初始化enumItems
   */
  initEnumItems(): void {
    this.enumSvc.getEnumItem("Code").subscribe((items: EnumItem[]) => {
      //this.enumItems = items;
    });
  }

  /**
   * 初始化KeyValueItems
   */
  initKeyValueItems(): void {
    this.keyvalueItemSvc.getKeyValueItemByCode("Code").subscribe((items: KeyValueItem[]) => {
      // this.keyvalueItems = items;
    });
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
    console.log(this.queryObj);
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

  /*添加@modelSummary*/
  add@modelClassName(): void {
    Util.goTo("/systemmanage/@modelNameedit/add/new");
    //this.add@modelClassNameModal();
  }

  /*编辑@modelSummary*/
  edit@modelClassName(@modelName: @modelClassName): void {
    Util.goTo("/systemmanage/@modelNameedit/edit/" + @modelName.id);
    //this.edit@modelClassNameModal(@modelName);
  }

  /*查看@modelSummary详情*/
  view@modelClassName(@modelName: @modelClassName): void {
    Util.goTo("/systemmanage/@modelNamedetail/" + @modelName.id);
    //this.view@modelClassNameModal(@modelName);
  }

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

  /*添加@modelSummary*/
  add@modelClassNameModal(): void {
    let @modelName = new @modelClassName();
    this.edit@modelClassNameModal(@modelName);
  }

  /*编辑@modelSummary*/
  edit@modelClassNameModal(@modelName: @modelClassName): void {
    let title = @modelName.id ? "编辑@modelSummary" : "添加@modelSummary";
    const modal: NzModalRef = this.modalSvc.create({
      nzTitle: title,
      nzWidth: 720,
      nzContent: @modelClassNameEditModalComponent,
      nzData: { @modelName: @modelName },
      nzCentered: true,
      nzMaskClosable: false,
      nzNoAnimation: true,
      nzOkText: null,
      nzCancelText: null,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.query@modelClassNameList(true);
      }
    });
  }

  /*查看@modelSummary详情*/
  view@modelClassNameModal(@modelName: @modelClassName): void {
    this.modalSvc.create({
      nzTitle: "查看@modelSummary",
      nzWidth: 720,
      nzContent: @modelClassNameDetailModalComponent,
      nzData: { @modelNameId: @modelName.id },
      nzCentered: true,
      nzMaskClosable: false,
      nzNoAnimation: true,
      nzOkText: null,
      nzCancelText: null,
    });
  }
}`;
    return template;
  }
}
