import { StringHelper } from '@core/stringhelper';
import { TsModel } from '@models/tsmodel';

export class EditPageTsCreator {
  // 获取列表页面的component代码
  static getEditPageTsCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;

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

    code = template
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
    if (this.@modelNameId) {
      this.get@modelClassName();
    }
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

  /*获取@modelSummary*/
  get@modelClassName(): void {
    this.@modelNameSvc.get@modelClassNameById(this.@modelNameId).subscribe((@modelName) => {
      this.@modelName = @modelName;
      this.editForm.patchValue(this.@modelName);
    });
  }

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
}
