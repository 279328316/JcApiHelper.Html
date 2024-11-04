import { StringHelper } from '@core/stringhelper';
import { TsModel } from '@models/tsmodel';

export class DetailModalTsCreator {
  // 获取列表页面的component代码
  static getDetailModalTsCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;

    let code = '';
    let template = DetailModalTsCreator.getTsTemplate();

    let editPiList = pageBaseModel.piList.filter((pi) => pi.isDetail);
    let editItemCode = '';
    let editItemBuildCode = '';
    for (let pi of editPiList) {
      let piName = StringHelper.firstToLower(pi.name);
      let piType = pi.tsType;
      let isRequire = pi.isRequire;
      let piDefaultValue = "''";
      switch (piType) {
        case 'string':
          piDefaultValue = "''";
          break;
        case 'number':
          piDefaultValue = '0';
          break;
        case 'boolean':
          piDefaultValue = 'false';
          break;
        case 'date':
          piDefaultValue = 'null';
          break;
        default:
          piDefaultValue = 'null';
          break;
      }
      editItemCode += `    ${piName}: FormControl<${piType}>;`;
      editItemBuildCode += `      ${piName}: [${piDefaultValue}, ${isRequire ? 'Validators.required' : ''}],`;
    }

    code = template
      .replace(/@editItemCode/g, editItemCode)
      .replace(/@editItemBuildCode/g, editItemBuildCode)
      .replace(/@modelName/g, modelName)
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@modelSummary/g, modelSummary);
    return code;
  }

  private static getTsTemplate(): string {
    let template = `import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { Util } from "@core/util";
import { @modelClassName } from "@models/@modelName";
import { @modelClassNameService } from "@services/@modelNameservice";
import { @modelClassNameEditModalComponent } from "../@modelNameeditmodal/@modelNameedit.component";

@Component({
  selector: "app-@modelNamedetail",
  templateUrl: "./@modelNamedetail.component.html",
  styleUrl: "./@modelNamedetail.component.less",
})
export class @modelClassNameDetailComponent implements OnInit {
  @modelNameId: string;
  @modelName: @modelClassName = new @modelClassName();

  constructor(
    private route: ActivatedRoute,
    private modalSvc: NzModalService,
    private modal: NzModalRef,
    private @modelNameSvc: @modelClassNameService,
    private @modelNameVersionSvc: @modelClassNameVersionService
  ) {}

  ngOnInit() {
    this.@modelNameId = this.modal.getConfig().nzData.@modelNameId;
    if (this.@modelNameId) {
      this.get@modelClassName();
    }
  }

  /*获取@modelSummary*/
  get@modelClassName(): void {
    this.@modelNameSvc.get@modelClassNameById(this.@modelNameId).subscribe((@modelName) => {
      this.@modelName = @modelName;
    });
  }

  /*编辑@modelSummary*/
  edit@modelClassName(): void {
    let title = "编辑@modelSummary";
    const modal: NzModalRef = this.modalSvc.create({
      nzTitle: title,
      nzWidth: 720,
      nzContent: @modelClassNameEditModalComponent,
      nzData: { @modelName: this.@modelName },
      nzCentered: true,
      nzMaskClosable: false,
      nzNoAnimation: true,
      nzOkText: null,
      nzCancelText: null,
    });
    // Return a result when closed
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.get@modelClassName();
      }
    });
  }

  /*删除@modelSummary*/
  delete@modelClassName(): void {
    Util.showConfirmBox('确认要删除@modelSummary' + this.@modelName.name + '?').subscribe((res) => {
      if (res) {
        this.@modelNameSvc.delete@modelClassName(this.@modelNameId).subscribe(() => {
          Util.goTo("/systemmanage/@modelNamelist");
        });
      }
    });
  }
  
  /*返回*/
  back(): void {
    history.back();
  }
}
`;
    return template;
  }
}
