import { StringHelper } from '@core/stringhelper';
import { DisplayType, TsPi } from '@models/propertyinfo';
import { TsModel } from '@models/tsmodel';
import { CodeCreator } from '../../codecreator';

export class EditPageTsCreator {
  // 获取列表页面的component代码
  static getEditPageTsCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;

    let code = '';
    let template = EditPageTsCreator.getTsTemplate();

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
      editItemCode += `    ${piName}: FormControl<${piType}>;`;
      editItemBuildCode += `      ${piName}: [${piDefaultValue}, ${isRequire ? 'Validators.required' : ''}],`;
    }
    let expandPropertyCode = '';
    let expandInitCode = '';
    let expandFunctionCode = '';
    if (editPiList.filter((a) => a.isKeyvalueItem).length > 0) {
      let piList = editPiList.filter((a) => a.isKeyvalueItem);
      for (let pi of piList) {
        // 如果以id结尾，则去掉id
        let piClassName = pi.name.endsWith('Id') ? pi.name.substring(0, pi.name.length - 2) : pi.name;
        let piName = StringHelper.firstToLower(piClassName);
        expandPropertyCode += `\n  ${piName}s: KeyvalueItem[] = [];`;
        expandFunctionCode += CodeCreator.getKeyvalueItemPiInitCode(pi);
        expandInitCode += `\n    this.init${piClassName}();`;
      }
    } else if (editPiList.filter((a) => a.isEnum).length > 0) {
      let piList = editPiList.filter((a) => a.isEnum);
      for (let pi of piList) {
        let piName = StringHelper.firstToLower(pi.name);
        let piClassName = pi.name;
        expandPropertyCode += `  ${piName}s: EnumItem[] = [];`;
        expandFunctionCode += CodeCreator.getEnumPiInitCode(pi);
        expandInitCode += `\n    this.init${piClassName}();`;
      }
    }
    if (editPiList.filter((a) => a.editDisplayType == DisplayType.UploadFile).length > 0) {
      expandPropertyCode += ``;
      expandFunctionCode += EditPageTsCreator.getUploadFileFunctionCode();
    }
    code = template
      .replace(/@expandPropertyCode/g, expandPropertyCode)
      .replace(/@expandInitCode/g, expandInitCode)
      .replace(/@expandFunctionCode/g, expandFunctionCode)
      .replace(/@editItemCode/g, editItemCode)
      .replace(/@editItemBuildCode/g, editItemBuildCode)
      .replace(/@modelName/g, modelName)
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@modelSummary/g, modelSummary);
    return code;
  }

  private static getTsTemplate(): string {
    let template = `import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { @modelClassName } from '@models/@modelName';
import { @modelClassNameService } from '@services/@modelNameservice';
import { EnumService } from '@services/enumservice';
import { EnumItem } from '@models/enumitem';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-@modelNameeditpage',
  templateUrl: './@modelNameedit.component.html',
  styleUrl: './@modelNameedit.component.less',
})
export class @modelClassNameEditComponent implements OnInit {
  @modelNameId: string;
  @modelName: @modelClassName = new @modelClassName();  
  @expandPropertyCode
  editForm!: FormGroup<{
    @editItemCode
  }>;

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: NonNullableFormBuilder,
    private enumSvc: EnumService,
    private @modelNameSvc: @modelClassNameService
  ) {}

  ngOnInit(): void {
    this.@modelNameId = this.route.snapshot.params['id'];    
    this.editForm = this.formBuilder.group({
      @editItemBuildCode
    });
    @expandInitCode
    if (this.@modelNameId) {
      this.get@modelClassName();
    }
  }

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
    this.@modelNameSvc.set@modelClassName(this.@modelName).subscribe((res) => {
      this.back();
    });
  }

  /**
   * 返回上一页
   */
  back(): void {
    history.back();
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
