import { CodeCreator } from '@core/PageHelper/codecreator';
import { StringHelper } from '@core/stringhelper';
import { TsModel } from '@models/tsmodel';

export class DetailModalTsCreator {
  // 获取列表页面的component代码
  static getDetailModalTsCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;

    let code = '';
    let template = DetailModalTsCreator.getTsTemplate();

    let expandPropertyCode = '';
    let expandInitCode = '';
    let expandFunctionCode = '';
    expandFunctionCode += CodeCreator.getEditFunctionCode(pageBaseModel);

    code = template
      .replace(/@expandPropertyCode/g, expandPropertyCode)
      .replace(/@expandInitCode/g, expandInitCode)
      .replace(/@expandFunctionCode/g, expandFunctionCode)
      .replace(/@modelName/g, modelName)
      .replace(/@modelLowerName/g, modelName.toLowerCase())
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
  selector: "app-@modelLowerNamedetail",
  templateUrl: "./@modelLowerNamedetail.component.html",
  styleUrl: "./@modelLowerNamedetail.component.less",
})
export class @modelClassNameDetailComponent implements OnInit {
  @modelNameId: string;
  @modelName: @modelClassName = new @modelClassName();
  @expandPropertyCode

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
    @expandInitCode
  }

  /*获取@modelSummary*/
  get@modelClassName(): void {
    this.@modelNameSvc.get@modelClassNameById(this.@modelNameId).subscribe((@modelName) => {
      this.@modelName = @modelName;
    });
  }
  @expandFunctionCode

  /*删除@modelSummary*/
  delete@modelClassName(): void {
    Util.showConfirmBox('确认要删除@modelSummary' + this.@modelName.name + '?').subscribe((res) => {
      if (res) {
        this.@modelNameSvc.delete@modelClassName(this.@modelNameId).subscribe(() => {
          this.modal.close(true);
        });
      }
    });
  }
  
  /*返回*/
  cancel(): void {
    this.modal.close(false);
  }
}
`;
    return template;
  }
}
