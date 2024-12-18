import { StringHelper } from '@core/stringhelper';
import { DisplayType, TsPi } from '@models/propertyinfo';
import { TsModel } from '@models/tsmodel';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

export class EditPageHtmlCreator {
  // 获取列表页面的html代码
  static getEditPageHtmlCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;
    let htmlCode = '';
    let htmlTemplate = `<nz-page-header>
    <nz-page-header-subtitle>{{@modelNameId ? '编辑@modelSummary':'新增@modelSummary'}}</nz-page-header-subtitle>
</nz-page-header>
<!--Content-->
<nz-card nzBordered="false">
    @editFormCode
</nz-card>`;
    let editFormCode = this.getEditFormCode(pageBaseModel);
    htmlCode = htmlTemplate
      .replace(/@modelName/g, modelName)
      .replace(/@modelSummary/g, modelSummary)
      .replace(/@editFormCode/g, editFormCode);
    return htmlCode;
  }

  // 获取查询表单的html代码
  private static getEditFormCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;
    let editFormCode = '';
    let editFormTemplate = `<nz-form [formGroup]="editForm" nzLayout="vertical">@editItemCode
        <div nz-row class="mt35">
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12" class="tac">
                <button nz-button nzType="primary" class="w100" (click)="save()">保存</button>
                <button nz-button nzType="primary" class="w100 ml50" (click)="back()">取消</button>
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
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;
    let piName = StringHelper.firstToLower(pi.name);
    let piListName = piName.endsWith('Id') ? piName.substring(0, piName.length - 2) : piName;
    let piSummary = !pi.summary ? piName : pi.summary;
    let isRequire = pi.isRequire ?? piName;

    if (pi.editDisplayType == DisplayType.Select) {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label nzRequired class="w100 mr5">@piSummary</nz-form-label>
                    <nz-form-control ${isRequire ? 'nzErrorTip="请选择@piSummary"' : ''}>
                        <nz-select formControlName="@piName" nzAllowClear nzPlaceHolder="-- 请 选 择 --">
                            <nz-option *ngFor="let @piListName of @piListNames" [nzValue]="@piListName.value"
                                [nzLabel]="@piListName.displayName"></nz-option>
                        </nz-select>
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else if (pi.editDisplayType == DisplayType.RadioGroup) {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w100 mr5">@piSummary</nz-form-label>
                    <nz-form-control>
                        <nz-radio-group formControlName="@piName">
                            <label nz-radio *ngFor="let @piListName of @piListNames" [nzValue]="@piListName.value">{{@piListName.displayName}}</label>
                        </nz-radio-group>
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else if (pi.editDisplayType == DisplayType.Switch) {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w100 mr5">@piSummary</nz-form-label>
                    <nz-form-control>
                        <nz-switch formControlName="@piName"></nz-switch>
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else if (pi.editDisplayType == DisplayType.Checkbox) {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w100 mr5">@piSummary</nz-form-label>
                    <nz-form-control>
                        <label nz-checkbox formControlName="@piName"></label>
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else if (pi.editDisplayType == DisplayType.DatePicker) {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w100 mr5">@piSummary</nz-form-label>
                    <nz-form-control ${isRequire ? 'nzErrorTip="请选择@piSummary"' : ''}>
                        <nz-date-picker formControlName="@piName"></nz-date-picker>
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else if (pi.editDisplayType == DisplayType.Rate) {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w100 mr5">@piSummary</nz-form-label>                    
                    <nz-form-control ${isRequire ? 'nzErrorTip="请设置@piSummary"' : ''}>
                        <nz-rate formControlName="@piName" nzAllowHalf></nz-rate>
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else if (pi.editDisplayType == DisplayType.UploadFile) {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w100 mr5">@piSummary</nz-form-label>                    
                    <nz-form-control ${isRequire ? 'nzErrorTip="请设置@piSummary"' : ''}>   
                        @if (!uploadFile)                     
                        <a style="position: relative;" href="javascript:void(0)">
                            <button nz-button class="w120 mr10" nzType="primary" nzGhost>选择文件</button>
                            <input type="file" accept=".doc" name="file" (change)="selectUploadFiles($event)"
                                style="position: absolute; top: 0; left: 0; opacity: 0;" />
                        </a>
                        }
                        @else if (uploadFile.fileStatus ==1) {
                        <div nz-row [nzGutter]="16">
                            <div nz-col nzSpan="10">
                                <nz-progress [nzPercent]="uploadFile.progress"></nz-progress>
                            </div>
                            <div nz-col nzSpan="12">
                                <a (click)='cancelUpload()'>
                                    取消上传
                                </a>
                            </div>
                        </div>
                        } @else if (uploadFile.fileStatus!=1) {
                        <a [title]="uploadFile.fileName" class="maxw200">
                            {{uploadFile.fileName}}
                        </a>
                        <a class="ml10" (click)='deleteUploadFile()'>
                            <span nz-icon nzType="delete" nzTheme="outline"></span>
                        </a>
                        <span *ngIf="uploadFile.fileStatus==2 || uploadFile.fileStatus == 3" class="ml10 color-red">
                            {{uploadFile.fileStatusStr}}
                            <span class="ml10 maxw200" [title]="uploadFile.fileStatusNote">
                                {{uploadFile.fileStatusNote |nzEllipsis:36:'...'}}
                            </span>
                        </span>
                        }
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else if (pi.editDisplayType == DisplayType.TextArea) {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w100 mr5">@piSummary</nz-form-label>                    
                    <nz-form-control ${isRequire ? 'nzErrorTip="请设置@piSummary"' : ''}>
                        <textarea nz-input formControlName="@piName" rows="4" placeholder="请输入@piSummary" nzAutoSize></textarea>
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else if (pi.editDisplayType == DisplayType.InputNumber) {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w100 mr5">@piSummary</nz-form-label>                    
                    <nz-form-control ${isRequire ? 'nzErrorTip="请输入@piSummary"' : ''}>
                        <input nz-input type="number" formControlName="@piName" placeholder="请输入@piSummary" />
                    </nz-form-control>
                </nz-form-item>
            </div>
        </div>`;
    } else {
      editCodeTemplate = `
        <div nz-row>
            <div nz-col [nzXs]="24" [nzSm]="24" [nzMd]="12" [nzLg]="12">
                <nz-form-item>
                    <nz-form-label class="w100 mr5">@piSummary</nz-form-label>
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
      .replace(/@piListName/g, piListName)
      .replace(/@piSummary/g, piSummary);
    return editCode;
  }
}
