import { Component, OnInit } from "@angular/core";
import { ApiService } from "@services/api.service";
import { ActivatedRoute } from "@angular/router";
import { TsModel, TsPi, TsResult } from "@models/tsmodel";
import { Util } from "@core/util";
import { StringHelper } from "@core/stringhelper";
import { NzFormatEmitEvent, NzTreeNode } from "ng-zorro-antd/tree";
import { NzContextMenuService, NzDropdownMenuComponent } from "ng-zorro-antd/dropdown";

export class PageTreeNode extends NzTreeNode {
  language: string;
  code: string;
  expanded: boolean;
}

@Component({
  selector: "app-codeviewer",
  templateUrl: "./codeviewer.component.html",
  styleUrls: ["./codeviewer.component.less"],
})
export class CodeViewerComponent implements OnInit {
  itemId: string;
  itemType: string;
  tsServiceType = "1";
  tsModelViewType = "1";
  isShowPageQueryModel = true;

  tsResult: TsResult;
  tsModelList: TsModel[] = [];

  tsModelCode: string;
  tsModelCodeWithPgQuery: string;

  pageBaseModel: TsModel;

  showCode: boolean = false;
  codeTitle: string;
  tsCode: string;

  isCtrlDown: boolean = false;
  isShiftDown: boolean = false;

  rootNode: PageTreeNode = <PageTreeNode>{
    title: "pages",
    key: "pages",
    expanded: true,
    children: [],
  };

  pageNodes: PageTreeNode[] = [this.rootNode];
  activatedNode?: PageTreeNode;

  pageCode = "";
  pageCodeTitle = "";
  pageLanguage = "html";

  constructor(
    private routerParams: ActivatedRoute,
    private nzContextMenuService: NzContextMenuService,
    private apiSvc: ApiService
  ) {
    const tsServiceType = localStorage.getItem("tsServiceType");
    this.tsServiceType = tsServiceType ? tsServiceType : "1";

    const tsModelViewType = localStorage.getItem("tsModelViewType");
    this.tsModelViewType = tsModelViewType ? tsModelViewType : "1";

    const isShowPageQueryModel = localStorage.getItem("isShowPageQueryModel");
    if (isShowPageQueryModel === "false") {
      this.isShowPageQueryModel = false;
    }
  }

  ngOnInit() {
    this.itemId = this.routerParams.snapshot.paramMap.get("itemId");
    this.itemType = this.routerParams.snapshot.paramMap.get("itemType");
    if (this.itemId && this.itemType) {
      this.getTsModel();
    }
  }

  /*获取TsModel*/
  getTsModel() {
    this.apiSvc.GetTsModel(this.itemId, this.itemType).subscribe((tsResult: TsResult) => {
      this.tsResult = tsResult;
      this.tsModelList = this.tsResult.tsModelList;
      if (this.tsModelList?.length > 0) {
        let filterModels = this.tsModelList.filter((x) => x.name.toLowerCase() === this.tsResult.name.toLowerCase());
        if (filterModels.length > 0) {
          this.pageBaseModel = filterModels[0];
        } else {
          filterModels = this.tsModelList.filter((x) => x.name.indexOf("<") < 0);
          this.pageBaseModel = filterModels.length > 0 ? filterModels[0] : null;
        }
        if (this.pageBaseModel) {
          this.generatePages();
        }
      }
    });
  }

  // BaseModelChange
  pageBaseModelChange(value: TsModel): void {
    if (value) {
      //this.generatePages();
    }
  }

  // 生成页面代码
  generatePages() {
    console.log(this.rootNode);
    if (!this.pageBaseModel) {
      return;
    }
    let filterNodes = this.rootNode.children;
    if (filterNodes.filter((a) => a.key == this.pageBaseModel.id).length > 0) {
      return;
    }
    let modelId = this.pageBaseModel.id.toLocaleLowerCase();
    let modelName = this.pageBaseModel.name.toLocaleLowerCase();
    let pageNode = <PageTreeNode>{
      title: modelName,
      key: modelId,
      expanded: true,
      children: [],
    };
    this.rootNode.children.push(pageNode);

    {
      let listPageNode = <PageTreeNode>{
        title: modelName + "list",
        key: modelId + "list",
        expanded: false,
        children: [],
      };
      pageNode.children.push(listPageNode);

      let listPageHtmlNode = <PageTreeNode>{
        title: modelName + "list.html",
        key: modelId + "list.html",
        isLeaf: true,
      };
      let listPageLessNode = <PageTreeNode>{
        title: modelName + "less.ts",
        key: modelId + "less.ts",
        isLeaf: true,
      };
      let listPageTsNode = <PageTreeNode>{
        title: modelName + "list.ts",
        key: modelId + "list.ts",
        isLeaf: true,
      };
      listPageNode.children.push(listPageHtmlNode);
      listPageNode.children.push(listPageLessNode);
      listPageNode.children.push(listPageTsNode);
    }

    {
      let editPageNode = <PageTreeNode>{
        title: modelName + "edit",
        key: modelId + "edit",
        expanded: false,
        children: [],
      };
      pageNode.children.push(editPageNode);

      let editPageHtmlNode = <PageTreeNode>{
        title: modelName + "edit.html",
        key: modelId + "edit.html",
        isLeaf: true,
      };
      let editPageLessNode = <PageTreeNode>{
        title: modelName + "less.ts",
        key: modelId + "less.ts",
        isLeaf: true,
      };
      let editPageTsNode = <PageTreeNode>{
        title: modelName + "edit.ts",
        key: modelId + "edit.ts",
        isLeaf: true,
      };
      editPageNode.children.push(editPageHtmlNode);
      editPageNode.children.push(editPageLessNode);
      editPageNode.children.push(editPageTsNode);
    }

    {
      let editPageNode = <PageTreeNode>{
        title: modelName + "edit_modal",
        key: modelId + "edit_modal",
        expanded: false,
        children: [],
      };
      pageNode.children.push(editPageNode);

      let editPageHtmlNode = <PageTreeNode>{
        title: modelName + "edit.html",
        key: modelId + "edit_modal.html",
        isLeaf: true,
      };
      let editPageLessNode = <PageTreeNode>{
        title: modelName + "less.ts",
        key: modelId + "less_modal.ts",
        isLeaf: true,
      };
      let editPageTsNode = <PageTreeNode>{
        title: modelName + "edit.ts",
        key: modelId + "edit_modal.ts",
        isLeaf: true,
      };
      editPageNode.children.push(editPageHtmlNode);
      editPageNode.children.push(editPageLessNode);
      editPageNode.children.push(editPageTsNode);
    }

    {
      let detailPageNode = <PageTreeNode>{
        title: modelName + "detail",
        key: modelId + "detail",
        expanded: false,
        children: [],
      };
      pageNode.children.push(detailPageNode);
      let detailPageHtmlNode = <PageTreeNode>{
        title: modelName + "detail.html",
        key: modelId + "detail.html",
        isLeaf: true,
      };
      let detailPageLessNode = <PageTreeNode>{
        title: modelName + "less.ts",
        key: modelId + "less.ts",
        isLeaf: true,
      };
      let detailPageTsNode = <PageTreeNode>{
        title: modelName + "detail.ts",
        key: modelId + "detail.ts",
        isLeaf: true,
      };
      detailPageNode.children.push(detailPageHtmlNode);
      detailPageNode.children.push(detailPageLessNode);
      detailPageNode.children.push(detailPageTsNode);
    }

    {
      let detailPageNode = <PageTreeNode>{
        title: modelName + "detail_modal",
        key: modelId + "detail_modal",
        expanded: false,
        children: [],
      };
      pageNode.children.push(detailPageNode);
      let detailPageHtmlNode = <PageTreeNode>{
        title: modelName + "detail.html",
        key: modelId + "detail_modal.html",
        isLeaf: true,
      };
      let detailPageLessNode = <PageTreeNode>{
        title: modelName + "less.ts",
        key: modelId + "less_modal.ts",
        isLeaf: true,
      };
      let detailPageTsNode = <PageTreeNode>{
        title: modelName + "detail.ts",
        key: modelId + "detail_modal.ts",
        isLeaf: true,
      };
      detailPageNode.children.push(detailPageHtmlNode);
      detailPageNode.children.push(detailPageLessNode);
      detailPageNode.children.push(detailPageTsNode);
    }
  }

  nodes = [
    {
      title: "pages",
      key: "2",
      expanded: true,
      children: [
        {
          title: "appmanage",
          key: "3",
          expanded: true,
          children: [
            {
              title: "applist.ts",
              key: "applist",
              expanded: false,
              children: [
                { title: "leaf 1-0", key: "1010", isLeaf: true },
                { title: "leaf 1-1", key: "1011", isLeaf: true },
                { title: "leaf 1-1", key: "1013", isLeaf: true },
              ],
            },
            {
              title: "appedit",
              key: "4",
              expanded: false,
              children: [
                { title: "leaf 1-0", key: "1010", isLeaf: true, code: "123", language: "html" },
                { title: "leaf 1-1", key: "1011", isLeaf: true },
                { title: "leaf 1-1", key: "1014", isLeaf: true },
              ],
            },
          ],
        },
      ],
    },
  ];

  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  activeNode(data: NzFormatEmitEvent): void {
    this.activatedNode = data.node! as PageTreeNode;
    if (!this.activatedNode.isLeaf) {
      this.activatedNode.isExpanded = !this.activatedNode.isExpanded;
    } else {
      this.pageCode = this.activatedNode.code;
      this.pageLanguage = this.activatedNode.language;
      this.pageCodeTitle = this.activatedNode?.title;
    }
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  selectDropdown(): void {
    // do something
  }

  /*选择Model 属性*/
  selectPi(tsModel: TsModel, pi: TsPi, index: number) {
    this.tsResult.tsModelList.forEach((a) => {
      if (a !== tsModel) {
        a.piList.forEach((p) => {
          p.isSelected = false;
        });
      }
    });

    if (!this.isCtrlDown && !this.isShiftDown) {
      //如果非多选,取消其它选中
      tsModel.piList
        .filter((a) => a.isSelected === true)
        .forEach((a, index) => {
          if (a != pi) {
            a.isSelected = false;
          }
        });
      pi.isSelected = !pi.isSelected;
    } else if (this.isCtrlDown) {
      pi.isSelected = !pi.isSelected;
    } else if (this.isShiftDown) {
      let minIndex: number = -1;
      let maxIndex: number = -1;
      tsModel.piList
        .filter((a) => a.isSelected === true)
        .forEach((a) => {
          let index = tsModel.piList.indexOf(a);
          if (minIndex === -1 || minIndex > index) {
            minIndex = index;
          }
          if (maxIndex === -1 || maxIndex < index) {
            maxIndex = index;
          }
        });
      if (minIndex === -1) {
        //之前没有选中的
        pi.isSelected = !pi.isSelected;
        return;
      }
      if (index === minIndex || index === maxIndex) {
        //选中当前第一条或最后一条
        pi.isSelected = !pi.isSelected;
        return;
      }

      //Shift按下 选中原则 从低到高
      if (index < minIndex) {
        //选中下面的行
        for (let i = index; i <= maxIndex; i++) {
          tsModel.piList[i].isSelected = true;
        }
      } else if (index > maxIndex) {
        //选中上面的行
        for (let i = minIndex; i <= index; i++) {
          tsModel.piList[i].isSelected = true;
        }
      } else {
        //选中中间行
        for (let i = minIndex; i <= index; i++) {
          tsModel.piList[i].isSelected = true;
        }
        for (let i = index + 1; i <= maxIndex; i++) {
          tsModel.piList[i].isSelected = false;
        }
      }
    }
  }

  /* name参数排序 */
  nameSortFn(a: any, b: any, sortOrder: string) {
    return a["name"].localeCompare(b["name"]);
  }

  /* value参数排序 */
  valueSortFn(a: any, b: any, sortOrder: string) {
    return a["paramValue"] - b["paramValue"];
  }

  /* type参数排序 */
  typeSortFn(a: any, b: any, sortOrder: string) {
    return a["typeName"].localeCompare(b["typeName"]);
  }

  /*查看Lambda Code*/
  viewLambda(tsModel: TsModel) {
    if (tsModel.piList.filter((a) => a.isSelected).length <= 0) {
      Util.showInfoBox("No record is selected.");
      return;
    }
    let selectedPiList = tsModel.piList.filter((a) => a.isSelected);

    // SetValue Lambda
    let setValueLambda = "//1 SetValue \r\n";
    setValueLambda +=
      tsModel.name + " " + StringHelper.firstToLower(tsModel.name) + " = new " + tsModel.name + "();\r\n";
    selectedPiList.forEach((a, index) => {
      setValueLambda +=
        StringHelper.firstToLower(tsModel.name) +
        "." +
        StringHelper.firstToLower(a.name) +
        " = source." +
        StringHelper.firstToLower(a.name) +
        ";\r\n";
    });

    // Ctor Lambda
    let ctorLambda = "//2 C# Ctor \r\n";
    ctorLambda += tsModel.name + " " + StringHelper.firstToLower(tsModel.name) + " = new " + tsModel.name + "(){\r\n";
    selectedPiList.forEach((a, index) => {
      ctorLambda += "  " + a.name + " = source." + a.name;
      if (index < selectedPiList.length - 1) {
        ctorLambda += ",";
      }
      ctorLambda += "\r\n";
    });
    ctorLambda += "};\r\n";

    // Expression Lambda
    let expLambda = "//3 Expression Lambda \r\n";
    if (selectedPiList.length == 1) {
      //length == 1
      expLambda += "a => a." + selectedPiList[0].name + "\r\n";
    } else {
      //length > 1
      expLambda += "var exp = ExpressionHelper.CreateExpression<" + tsModel.name + ">(a => new {\r\n";
      selectedPiList.forEach((a, index) => {
        expLambda += "  " + "a." + a.name;
        if (index < selectedPiList.length - 1) {
          expLambda += ",";
        }
        expLambda += "\r\n";
      });
      expLambda += "};\r\n";
    }

    this.tsCode = "\r\n" + setValueLambda + "\r\n" + ctorLambda + "\r\n" + expLambda;
    this.codeTitle = tsModel.name + " Lambda";
    this.showCode = true;
  }

  /*隐藏Modal*/
  closeModal() {
    this.showCode = false;
  }

  /*ModelView类型变化*/
  modelViewTypeChanged() {
    localStorage.setItem("tsModelViewType", this.tsModelViewType);
  }

  /*isShowPageQueryModel变化*/
  isShowPageQueryModelChanged() {
    localStorage.setItem("isShowPageQueryModel", this.isShowPageQueryModel.toString());
  }

  /*使用服务类型变化*/
  tsServiceTypeChanged() {
    localStorage.setItem("tsServiceType", this.tsServiceType);
  }

  /*keyDownHandler*/
  onKeyDownHandler(event: any): void {
    switch (event.keyCode) {
      case 16: //Shift  暂时不支持Shift
        this.isShiftDown = true;
        event.preventDefault();
        break;
      case 17: //Ctrl
        this.isCtrlDown = true;
        event.preventDefault();
        break;
      case 37: //← 左
        break;
      case 38: //↑ 上
        if (this.isCtrlDown || this.isShiftDown) {
        } else {
        }
        event.preventDefault();
        break;
      case 39: //→ 右
        break;
      case 40: //↓ 下
        if (this.isCtrlDown || this.isShiftDown) {
        } else {
        }
        event.preventDefault();
        break;
      default:
        break;
    }

    //console.log('onKeyDown this.isShiftDown:',this.isShiftDown);
    //console.log('onKeyDown this.isCtrlDown:',this.isCtrlDown);
  }

  /*keyUpHandler*/
  onKeyUpHandler(event: any): void {
    switch (event.keyCode) {
      case 16: //Shift
        this.isShiftDown = false;
        event.preventDefault();
        break;
      case 17: //Ctrl
        this.isCtrlDown = false;
        event.preventDefault();
        break;
      default:
        break;
    }
    //console.log('onKeyUp this.isShiftDown:',this.isShiftDown);
    //console.log('onKeyUp this.isCtrlDown:',this.isCtrlDown);
  }

  /*返回 使用浏览器后退功能*/
  goback() {
    history.back();
  }
}
