import { Component, OnInit } from "@angular/core";
import { ApiService } from "@services/api.service";
import { ActivatedRoute } from "@angular/router";
import { TsModel, TsPi, TsResult } from "@models/tsmodel";
import { Util } from "@core/util";
import { StringHelper } from "@core/stringhelper";
import { NzContextMenuService, NzDropdownMenuComponent } from "ng-zorro-antd/dropdown";
import { NzFormatEmitEvent, NzTreeNode } from "ng-zorro-antd/tree";

import "prismjs/components/prism-csharp.min.js";
import "prismjs/components/prism-typescript.min.js";

@Component({
  selector: "app-codegenerator",
  templateUrl: "./codegenerator.component.html",
  styleUrls: ["./codegenerator.component.less"],
})
export class CodeGeneratorComponent implements OnInit {
  controllerId: string;

  tsServiceType = "1";
  tsModelViewType = "1";
  isShowPageQueryModel = true;
  tsResult: TsResult;

  tsModelCode: string;
  tsModelCodeWithPgQuery: string;

  showCode: boolean = false;
  codeTitle: string;
  tsCode: string;

  isCtrlDown: boolean = false;
  isShiftDown: boolean = false;
  code = "";
  htmlCode = `
  <nz-tabset>
    <nz-tab nzTitle="Tab 1">
      <ng-template nz-tab-content>
        <div>Content for Tab 1</div>
      </ng-template>
    </nz-tab>
    <nz-tab nzTitle="Tab 2">
      <ng-template nz-tab-content>
        <div>Content for Tab 2</div>
      </ng-template>
    </nz-tab>
  </nz-tabset>
`;
  language = "html";

  constructor(
    private routerParams: ActivatedRoute,
    private apiSvc: ApiService,
    private nzContextMenuService: NzContextMenuService
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
    this.controllerId = this.routerParams.snapshot.paramMap.get("controllerId");
    if (this.controllerId) {
      this.getCodeTree();
    }

    this.code = this.htmlCode;
  }

  activatedNode?: NzTreeNode;
  nodes = [
    {
      title: "models",
      key: "1",
      expanded: true,
      children: [
        { title: "api.ts", key: "1", isLeaf: true },
        { title: "robj.ts", key: "2", isLeaf: true },
      ],
    },
    {
      title: "pages",
      key: "2",
      expanded: true,
      children: [
        {
          title: "appmanage",
          key: "3",
          expanded: false,
          children: [
            {
              title: "applist",
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
                { title: "leaf 1-0", key: "1010", isLeaf: true },
                { title: "leaf 1-1", key: "1011", isLeaf: true },
                { title: "leaf 1-1", key: "1014", isLeaf: true },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "services",
      key: "5",
      expanded: true,
      children: [
        { title: "leaf 1-0", key: "1020", isLeaf: true },
        { title: "leaf 1-1", key: "1021", isLeaf: true },
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
    this.activatedNode = data.node!;
    if (!this.activatedNode.isLeaf) {
      this.activatedNode.isExpanded = !this.activatedNode.isExpanded;
    }
    if (this.activatedNode.key == "1") {
      this.code = this.htmlCode;
      this.language = "html";
      this.codeTitle = "TestHtml";
    } else {
      if (this.tsResult.tsModelList) {
        this.tsResult.tsModelList[0].piList.forEach((a) => (a.isSelected = true));
        this.viewLambda(this.tsResult.tsModelList[0]);
        this.code = this.tsCode;
        this.language = "typescript";
      } else {
        this.code = "";
      }
    }
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  selectDropdown(): void {
    // do something
  }

  /*获取TsModel*/
  getCodeTree() {
    this.apiSvc.getCodeTree(this.controllerId).subscribe((tsResult: TsResult) => {
      this.tsResult = tsResult;
      if (tsResult && tsResult.tsModelList) {
        let tsModelCode = "";
        let tsModelCodeWithPgQuery = "";
        tsResult.tsModelList.forEach((tsModel) => {
          tsModelCode += tsModel.tsModelCode;
          tsModelCodeWithPgQuery += tsModel.tsModelCode;
          tsModelCodeWithPgQuery += tsModel.pgQueryModelCode;
        });
        this.tsModelCode = tsModelCode;
        this.tsModelCodeWithPgQuery = tsModelCodeWithPgQuery;
      }
    });
  }

  /*查看Lambda Code*/
  viewLambda(tsModel: TsModel) {
    if (tsModel.piList.filter((a) => a.isSelected).length <= 0) {
      Util.showInfoBox("No record is selected.");
      return;
    }
    let selectedPiList = tsModel.piList.filter((a) => a.isSelected);
    let lambdaStr = "";

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

    // Expression Lambda
    let expLambda = "//2 Expression Lambda \r\n";
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

    // Ctor Lambda
    let ctorLambda = "//3 C# Ctor \r\n";
    ctorLambda += tsModel.name + " " + StringHelper.firstToLower(tsModel.name) + " = new " + tsModel.name + "(){\r\n";
    selectedPiList.forEach((a, index) => {
      ctorLambda += "  " + a.name + " = source." + a.name;
      if (index < selectedPiList.length - 1) {
        ctorLambda += ",";
      }
      ctorLambda += "\r\n";
    });
    ctorLambda += "};\r\n";

    this.tsCode = setValueLambda + "\r\n" + expLambda + "\r\n" + ctorLambda;
    this.codeTitle = tsModel.name + " Lambda";
    this.showCode = true;
  }

  /*隐藏Modal*/
  closeModal() {
    this.showCode = false;
  }

  /*返回 使用浏览器后退功能*/
  goback() {
    history.back();
  }
}
