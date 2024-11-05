import { StringHelper } from '@core/stringhelper';
import { TsPi } from '@models/propertyinfo';
import { TsModel } from '@models/tsmodel';

export class EditModalHtmlCreator {
  /**
   * 生成编辑模态框的HTML代码
   *
   * @param pageBaseModel 页面基础模型
   * @returns 返回生成的HTML代码字符串
   */
  static getEditModalHtmlCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;
    let htmlCode = '';
    let htmlTemplate = `<nz-card nzBordered="false" [nzSize]="'small'">
    @editFormCode
</nz-card>`;
    let editFormCode = this.getEditFormCode(pageBaseModel);
    htmlCode = htmlTemplate
      .replace(/@modelName/g, modelName)
      .replace(/@modelSummary/g, modelSummary)
      .replace(/@editFormCode/g, editFormCode);
    console.log(htmlCode);
    return htmlCode;
  }

  // 获取查询表单的html代码
  private static getEditFormCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;
    let editFormCode = '';
    let editFormTemplate = `<nz-form [formGroup]="editForm" nzLayout="vertical">@editItemCode
        <div nz-row class="mt35">
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12" class="tac">
                <button nz-button nzType="primary" class="w80" (click)="save()">保存</button>
                <button nz-button nzType="primary" class="w80 ml50" (click)="back()">取消</button>
            </div>
        </div>
    </nz-form>`;
    let editPiIndex = 0;
    let editPiList = pageBaseModel.piList.filter((pi) => pi.isEdit);
    let editItemCode = '';
    for (let pi of editPiList) {
      let piCode = this.getEditItemCode(pageBaseModel, pi);
      editItemCode += piCode;
      editPiIndex++;
    }
    editFormCode = editFormTemplate
      .replace(/@editItemCode/g, editItemCode)
      .replace(/@modelName/g, modelName)
      .replace(/@modelClassName/g, modelClassName);
    return editFormCode;
  }

  // 获取编辑参数项的html代码
  private static getEditItemCode(pageBaseModel: TsModel, pi: TsPi): string {
    let editCode = '';
    let editCodeTemplate = '';
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;
    let piName = StringHelper.firstToLower(pi.name);
    let piSummary = pi.summary ?? piName;
    let isRequire = pi.isRequire ?? piName;

    if (pi.isEnum) {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label nzRequired class="w80 mr5">@piSummary</nz-form-label>
                    <nz-form-control ${isRequire ? 'nzErrorTip="请选择@piSummary"' : ''}>
                        <nz-select formControlName="@piName" nzAllowClear nzPlaceHolder="-- 请 选 择 --">
                            <nz-option *ngFor="let @piName of @piNames" [nzValue]="@piName.value"
                                [nzLabel]="@piName.displayName"></nz-option>
                        </nz-select>
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else if (pi.tsType == 'boolean') {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w80 mr5">@piSummary</nz-form-label>
                    <nz-form-control>
                        <nz-switch formControlName="@piName"></nz-switch>
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else if (pi.tsType == 'Date') {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w80 mr5">@piSummary</nz-form-label>
                    <nz-form-control ${isRequire ? 'nzErrorTip="请选择@piSummary"' : ''}>
                        <nz-date-picker formControlName="@piName"></nz-date-picker>
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w80 mr5">@piName</nz-form-label>
                    <nz-form-control ${isRequire ? 'nzErrorTip="请输入@piSummary"' : ''}>
                        <input nz-input formControlName="@piName" placeholder="请输入@piSummary" />
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    }
    editCode = editCodeTemplate
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@piName/g, piName)
      .replace(/@piSummary/g, piSummary);
    return editCode;
  }
}
