import { StringHelper } from '@core/stringhelper';
import { DisplayType } from '@models/propertyinfo';
import { TsModel } from '@models/tsmodel';
import { CodeCreator } from '../../codecreator';

export class EditModalTsCreator {
  /**
   * 生成编辑模态框的组件代码
   *
   * @param pageBaseModel 页面基础模型对象
   * @returns 返回生成的组件代码
   */
  static getEditModalTsCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;

    let code = '';
    let template = EditModalTsCreator.getTsTemplate();

    let editPiList = pageBaseModel.piList.filter((pi) => pi.isEdit);
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
      editItemCode += `\n    ${piName}: FormControl<${piType}>;`;
      editItemBuildCode += `\n      ${piName}: [${piDefaultValue}, ${isRequire ? 'Validators.required' : ''}],`;
    }

    let expandPropertyCode = '';
    let expandInitCode = '';
    let expandInitFunctionCode = '';
    let expandFunctionCode = '';
    editPiList.forEach((pi) => {
      // 如果以id结尾，则去掉id
      let piClassName = pi.name.endsWith('Id') ? pi.name.substring(0, pi.name.length - 2) : pi.name;
      let piName = StringHelper.firstToLower(piClassName);
      if (pi.isKeyvalueItem) {
        if (pi.name.endsWith('Id')) {
          expandPropertyCode += `\n  ${piName}s: ${piClassName}[] = [];`;
          expandInitFunctionCode += CodeCreator.getForeignPiInitCode(pi);
        } else {
          expandPropertyCode += `\n  ${piName}s: KeyvalueItem[] = [];`;
          expandInitFunctionCode += CodeCreator.getKeyvalueItemPiInitCode(pi);
        }
        expandInitCode += `\n    this.init${piClassName}();`;
      } else if (pi.isEnum) {
        expandPropertyCode += `\n  ${piName}s: EnumItem[] = [];`;
        expandInitFunctionCode += CodeCreator.getEnumPiInitCode(pi);
        expandInitCode += `\n    this.init${piClassName}();`;
      }
    });
    if (editPiList.filter((a) => a.editDisplayType == DisplayType.UploadFile).length > 0) {
      expandPropertyCode += ``;
      expandFunctionCode += EditModalTsCreator.getUploadFileFunctionCode();
    }
    code = template
      .replace(/@expandPropertyCode/g, expandPropertyCode)
      .replace(/@expandInitCode/g, expandInitCode)
      .replace(/@expandInitFunctionCode/g, expandInitFunctionCode)
      .replace(/@expandFunctionCode/g, expandFunctionCode)
      .replace(/@editItemCode/g, editItemCode)
      .replace(/@editItemBuildCode/g, editItemBuildCode)
      .replace(/@modelName/g, modelName)
      .replace(/@modelLowerName/g, modelName.toLowerCase())
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@modelSummary/g, modelSummary);
    return code;
  }

  private static getTsTemplate(): string {
    let template = `import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from "ng-zorro-antd/modal";
import { @modelClassName } from '@models/@modelName';
import { @modelClassNameService } from '@services/@modelNameservice';
import { EnumService } from '@services/enumservice';
import { EnumItem } from '@models/enumitem';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-@modelLowerNameeditpage',
  templateUrl: './@modelLowerNameedit.component.html',
  styleUrl: './@modelLowerNameedit.component.less',
})
export class @modelClassNameEditComponent implements OnInit {
  @modelNameId: string;
  @modelName: @modelClassName = new @modelClassName();
  @expandPropertyCode
  editForm!: FormGroup<{@editItemCode
  }>;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: NonNullableFormBuilder,
    private enumSvc: EnumService,
    private @modelNameSvc: @modelClassNameService,
    private modal: NzModalRef
  ) {}

  ngOnInit(): void {
    this.@modelNameId = this.modal.getConfig().nzData.@modelNameId;  
    this.editForm = this.formBuilder.group({@editItemBuildCode
    });
    @expandInitCode
    if (this.@modelNameId) {
      this.get@modelClassName();
    }
  }
  @expandInitFunctionCode  
  /*获取@modelSummary*/
  get@modelClassName(): void {
    this.@modelNameSvc.get@modelClassNameById(this.@modelNameId).subscribe((@modelName) => {
      this.@modelName = @modelName;
      this.editForm.patchValue(this.@modelName);
    });
  }
  @expandFunctionCode
  /**
   * 提交表单，保存@modelSummary
   */
  save() {
    if (!this.editForm.valid) {
      Object.values(this.editForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    let formValue = this.editForm.value;
    this.@modelName = { ...this.@modelName, ...formValue };
    if (!this.@modelNameId) {
      this.@modelNameSvc.add@modelClassName(this.@modelName).subscribe((@modelName: @modelClassName) => {
        // this.@modelNameId = @modelName.id;
        // this.@modelName.id = @modelName.id;
        this.back();
      });
    } else {
      this.@modelNameSvc.update@modelClassName(this.@modelName).subscribe(() => {
        this.back();
      });
    }
  }

  /**
   * 取消操作
   *
   * @description 关闭模态框并返回false
   */
  cancel() {
    this.modal.close(false);
  }
}
`;
    return template;
  }

  /**
   * 获取上传文件功能代码
   */
  private static getUploadFileFunctionCode(): string {
    let code = `
  /*选择文件*/
  selectUploadFiles(event): void {
    const file = event.target.files[0];
    let fileObj = new FileObj();
    fileObj.fileName = file.name;
    fileObj.fileSize = file.size;
    fileObj.fileType = file.extension || "";
    fileObj.progress = 0;
    fileObj.progressStr = "";
    fileObj.file = file;
    fileObj.fileStatus = file.size > 0 ? 0 : -1;
    this.uploadFile = fileObj;
    this.editForm.patchValue({ fileName: fileObj.fileName });
  }
  
  /**
   * 上传文件前的预处理
   *
   * @param orderSeriesObj 订单系列对象
   * @returns 无返回值
   */
  preUploadFile(uploadFile: FileObj): void {
    // 创建 UploadApply 对象
    uploadFile.fileStatus = 1;
    uploadFile.fileStatusStr = "上传中";
    const uploadApply = new UploadApply();
    uploadApply.bussinessId = this.@modelName.id;
    uploadApply.name = uploadFile.fileName;
    uploadApply.fileType = uploadFile.fileType;
    uploadApply.fileSize = uploadFile.fileSize;
    uploadApply.md5 = uploadFile.md5;
    this.@modelNameSvc.preUploadFile(uploadApply).subscribe((token: StsTokenUpload) => {
      this.uploadOssFile(token, uploadFile.file);
    });
  }

  /*上传文件*/
  uploadOssFile(token: StsTokenUpload, file: File): void {
    this.updateUploadStatus(1, "正在上传", 0);
    let ossAccess = token;
    let ossClient = new OSS({
      region: "oss-cn-beijing",
      accessKeyId: ossAccess.authToken.accessId,
      accessKeySecret: ossAccess.authToken.accessSecrect,
      stsToken: ossAccess.authToken.securityToken,
      accessDir: ossAccess.authToken.accessDir,
      accessPath: ossAccess.authToken.accessPath,
      bucket: ossAccess.authToken.bucketName,
    });
    ossClient
      .multipartUpload(ossAccess.authToken.accessPath, file, {
        progress: (p) => {
          if (this.uploadFile.fileStatus == 3) {
            throw new Error("已取消上传");
          }
          this.updateProgress(p);
        },
      })
      .then((result) => {
        this.finishUpload(token);
      })
      .catch((err) => {
        if (this.uploadFile.fileStatus != 3) {
          this.updateUploadStatus(2, "上传异常", err.message || "上传失败");
        }
      });
  }

  /*取消上传文件*/
  cancelUpload() {
    this.updateUploadStatus(3, "已取消上传", "");
  }

  /*上传状态更新*/
  updateUploadStatus(status, statusStr, statusNote): void {
    this.uploadFile.fileStatus = status;
    this.uploadFile.fileStatusStr = statusStr;
    this.uploadFile.fileStatusNote = statusNote;
  }

  /*进度条设置*/
  updateProgress(p) {
    let progress = Math.floor(p * 100); // 转换为百分比整数
    this.uploadFile.progress = progress;
    this.uploadFile.progressStr = progress.toString() + '%';
  }

  /*完成上传文件*/
  finishUpload(token: StsTokenUpload): void {
    this.@modelNameSvc.finishUpload(token.uploadKey).subscribe((ossFileId: string) => {
      this.updateUploadStatus(4, "已上传", 100);
      this.@modelName.ossFileId = ossFileId;
      if (this.saveMode == 0) {
        // 保存
        this.save();
      }
    });
  }  
  `;
    return code;
  }
}
