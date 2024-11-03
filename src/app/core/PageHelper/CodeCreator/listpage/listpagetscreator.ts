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
    return code;
  }

  private static getTsTemplate(): string {
    let template = `
import { Component, OnInit } from "@angular/core";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { Util } from "@core/util";
import { @modalClassName, @modalClassNameQueryObj } from "@models/@modalNamemanage/@modalName";
import { PageResult } from "@models/page";
import { EnumItem } from "@models/enumitem";
import { KeyValueItem } from "@models/keyvalue";
import { @modalClassNameService } from "@services/@modalNamemanage/@modalNameservice";
import { EnumService } from "@services/enumservice";
import { KeyValueItemService } from "@services/keyvalueitemservice";
import { @modalClassNameEditModalComponent } from "../@modalNameeditmodal/@modalNameedit.component";
import { @modalClassNameDetailModalComponent } from "../@modalNamedetailmodal/@modalNamedetailmodal.component";

@Component({
  selector: "@modalName-@modalNamelist",
  templateUrl: "./@modalNamelist.component.html",
  styleUrl: "./@modalNamelist.component.less",
})
export class @modalClassNameListComponent implements OnInit {
  loading = false;
  totalCount: number = 0;
  queryObj: @modalClassNameQueryObj = new @modalClassNameQueryObj();
  @modalNameList: @modalClassName[] = [];

  constructor(
    private modalSvc: NzModalService,
    private enumSvc: EnumService,
    private keyvalueItemSvc: KeyValueItemService,
    private @modalNameSvc: @modalClassNameService
  ) {}

  ngOnInit(): void {
    Util.setTitle("@modelSummary管理");
    this.query@modalClassNameList();
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
      this.query@modalClassNameList();
    }
  }

  /**
   * 查询@modelSummary列表
   *
   * @param isReload 是否重新加载列表，默认为 false
   */
  query@modalClassNameList(isReload: boolean = false): void {
    this.loading = true;
    if (isReload) {
      this.queryObj.pageIndex = 1;
    }
    console.log(this.queryObj);
    this.@modalNameSvc.query@modalClassNameList(this.queryObj).subscribe({
      next: (pgResult: PageResult<@modalClassName>) => {
        this.@modalNameList = pgResult.rows;
        this.totalCount = pgResult.total;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
    });
  }

  /*添加@modelSummary*/
  add@modalClassName(): void {
    Util.goTo("/systemmanage/@modalNameedit/add/new");
    //this.add@modalClassNameModal();
  }

  /*编辑@modelSummary*/
  edit@modalClassName(@modalName: @modalClassName): void {
    Util.goTo("/systemmanage/@modalNameedit/edit/" + @modalName.id);
    //this.edit@modalClassNameModal(@modalName);
  }

  /*查看@modelSummary详情*/
  view@modalClassName(@modalName: @modalClassName): void {
    Util.goTo("/systemmanage/@modalNamedetail/" + @modalName.id);
    //this.view@modalClassNameModal(@modalName);
  }

  /*删除@modelSummary*/
  delete@modalClassName(@modalName: @modalClassName): void {
    Util.showConfirmBox("确认要删除@modelSummary" + @modalName.name + "吗?").subscribe((res) => {
      if (res) {
        this.@modalNameSvc.delete@modalClassName(@modalName.id).subscribe(() => {
          this.query@modalClassNameList();
        });
      }
    });
  }

  /*添加@modelSummary*/
  add@modalClassNameModal(): void {
    let @modalName = new @modalClassName();
    this.edit@modalClassNameModal(@modalName);
  }

  /*编辑@modelSummary*/
  edit@modalClassNameModal(@modalName: @modalClassName): void {
    let title = @modalName.id ? "编辑@modelSummary" : "添加@modelSummary";
    const modal: NzModalRef = this.modalSvc.create({
      nzTitle: title,
      nzWidth: 720,
      nzContent: @modalClassNameEditModalComponent,
      nzData: { @modalName: @modalName },
      nzCentered: true,
      nzMaskClosable: false,
      nzNoAnimation: true,
      nzOkText: null,
      nzCancelText: null,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.query@modalClassNameList(true);
      }
    });
  }

  /*查看@modelSummary详情*/
  view@modalClassNameModal(@modalName: @modalClassName): void {
    this.modalSvc.create({
      nzTitle: "查看@modelSummary",
      nzWidth: 720,
      nzContent: @modalClassNameDetailModalComponent,
      nzData: { @modalNameId: @modalName.id },
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
