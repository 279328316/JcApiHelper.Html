import { StringHelper } from '@core/stringhelper';
import {
  BooleanDisplayType,
  DateDisplayType,
  DisplayType,
  EnumDisplayType,
  NumberDisplayType,
  StringDisplayType,
  TsPi,
} from '@models/propertyinfo';
import { PageType, TsModel } from '@models/tsmodel';

export class CodeCreator {
  // 获取枚举属性初始化代码
  public static getEnumPiInitCode(pi: TsPi): string {
    let piName = StringHelper.firstToLower(pi.name);
    let piClassName = pi.name;
    let piSummary = !pi.summary ? piName : pi.summary;
    let code = `
  /**
   * 初始化@piSummary
   */
  init@piClassName(): void {
    this.enumSvc.getEnumItem('@piClassName').subscribe((items: EnumItem[]) => {
      this.@piNames = items;
    });
  }\n`;
    code = code
      .replace(/@piSummary/g, piSummary)
      .replace(/@piName/g, piName)
      .replace(/@piClassName/g, piClassName);
    return code;
  }

  // 获取KeyvalueItem属性初始化代码
  public static getKeyvalueItemPiInitCode(pi: TsPi): string {
    // 如果以id结尾，则去掉id
    let piClassName = pi.name.endsWith('Id') ? pi.name.substring(0, pi.name.length - 2) : pi.name;
    let piName = StringHelper.firstToLower(piClassName);
    let piSummary = !pi.summary ? piName : pi.summary;
    let code = `
  /**
   * 初始化@piSummary列表
   */
  init@piClassName(): void {
    this.keyvalueItemSvc.getKeyValueItemByCode("@piClassName").subscribe((items: KeyValueItem[]) => {
      this.@piNames = items;
    });
  }\n`;
    code = code
      .replace(/@piSummary/g, piSummary)
      .replace(/@piName/g, piName)
      .replace(/@piClassName/g, piClassName);
    return code;
  }

  // 获取ForeignPi属性初始化代码
  public static getForeignPiInitCode(pi: TsPi): string {
    // 如果以id结尾，则去掉id
    let piClassName = pi.name.endsWith('Id') ? pi.name.substring(0, pi.name.length - 2) : pi.name;
    let piName = StringHelper.firstToLower(piClassName);
    let piSummary = !pi.summary ? piName : pi.summary;

    let code = `
  /**
   * 初始化@piSummary列表
   */
  init@piClassName(): void {
    this.@piNameSvc.get@piClassNameList().subscribe((@piNames: @piClassName[]) => {
      this.@piNames = @piNames;
    });
  }\n`;
    code = code
      .replace(/@piSummary/g, piSummary)
      .replace(/@piName/g, piName)
      .replace(/@piClassName/g, piClassName);
    return code;
  }

  // 获取添加Function代码
  public static getAddFunctionCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;
    let code = '';
    if (pageBaseModel.editPageType == PageType.Page) {
      code = `
  /*添加@modelSummary*/
  add@modelClassName(): void {
    Util.goTo("/@modelNameedit/add");
  }\n`;
    } else {
      code = `
  /*添加@modelSummary*/
  add@modelClassName(): void {
    this.edit@modelClassName();
  }\n`;
    }
    code = code
      .replace(/@modelName/g, modelName)
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@modelSummary/g, modelSummary);
    return code;
  }

  // 获取编辑Function代码
  public static getEditFunctionCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;
    let code = '';
    if (pageBaseModel.editPageType == PageType.Page) {
      code = `
  /*编辑@modelSummary*/
  edit@modelClassName(): void {
    Util.goTo("/@modelNameedit/edit/" + this.@modelName.id);
  }\n`;
    } else {
      code = `
  /*编辑@modelSummary*/
  edit@modelClassName(@modelName: @modelClassName = null): void {
    let title = @modelName?.id ? "编辑@modelSummary" : "添加@modelSummary";
    const modal: NzModalRef = this.modalSvc.create({
      nzTitle: title,
      nzWidth: 720,
      nzContent: @modelClassNameEditModalComponent,
      nzData: { @modelNameId: @modelName?.id },
      nzCentered: true,
      nzMaskClosable: false,
      nzNoAnimation: true,
      nzOkText: null,
      nzCancelText: null,
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.query@modelClassNameList(true);
      }
    });
  }\n`;
    }
    code = code
      .replace(/@modelName/g, modelName)
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@modelSummary/g, modelSummary);
    return code;
  }

  // 获取View详情Function代码
  public static getViewDetailFunctionCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;
    let code = '';
    if (pageBaseModel.editPageType == PageType.Page) {
      code = `
  /*查看@modelSummary详情*/
  view@modelClassName(): void {
    Util.goTo("/systemmanage/@modelNamedetail/" + this.@modelName.id);
    //this.view@modelClassNameModal(@modelName);
  }\n`;
    } else {
      code = `
  /*查看@modelSummary详情*/
  view@modelClassName(@modelName: @modelClassName): void {
    this.modalSvc.create({
      nzTitle: "查看@modelSummary",
      nzWidth: 720,
      nzContent: @modelClassNameDetailModalComponent,
      nzData: { @modelNameId: @modelName.id },
      nzCentered: true,
      nzMaskClosable: false,
      nzNoAnimation: true,
      nzOkText: null,
      nzCancelText: null,
    });
  }\n`;
    }
    code = code
      .replace(/@modelName/g, modelName)
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@modelSummary/g, modelSummary);
    return code;
  }

  // 获取查询框显示类型
  public static getPiQueryDisplayType(pi: TsPi): DisplayType {
    let displayType = DisplayType.Input;
    if (pi.isEnum || pi.isKeyvalueItem) {
      displayType = EnumDisplayType.defaultQueryType;
    } else if (pi.tsType === 'Date') {
      displayType = DateDisplayType.defaultQueryType;
    } else if (pi.tsType == 'boolean') {
      displayType = BooleanDisplayType.defaultQueryType;
    } else if (pi.tsType == 'number') {
      displayType = NumberDisplayType.defaultQueryType;
    } else if (pi.tsType == 'string') {
      displayType = StringDisplayType.defaultQueryType;
    } else {
      displayType = DisplayType.Input;
    }
    return displayType;
  }

  // 获取Table List 显示类型
  public static getPiListDisplayType(pi: TsPi): DisplayType {
    let displayType = DisplayType.Text;
    if (pi.isEnum || pi.isKeyvalueItem) {
      displayType = EnumDisplayType.defaultListType;
    } else if (pi.tsType == 'Date') {
      displayType = DateDisplayType.defaultListType;
    } else if (pi.tsType == 'boolean') {
      displayType = BooleanDisplayType.defaultListType;
    } else if (pi.tsType == 'number') {
      displayType = NumberDisplayType.defaultListType;
    } else if (pi.tsType == 'string') {
      displayType = StringDisplayType.defaultListType;
    } else {
      displayType = DisplayType.Text;
    }
    return displayType;
  }

  // 获取编辑显示类型
  public static getPiEditDisplayType(pi: TsPi): DisplayType {
    let displayType = DisplayType.Input;
    if (pi.isEnum || pi.isKeyvalueItem) {
      displayType = EnumDisplayType.defaultEditType;
    } else if (pi.tsType == 'Date') {
      displayType = DateDisplayType.defaultEditType;
    } else if (pi.tsType == 'boolean') {
      displayType = BooleanDisplayType.defaultEditType;
    } else if (pi.tsType == 'number') {
      displayType = NumberDisplayType.defaultEditType;
    } else if (pi.tsType == 'string') {
      displayType = StringDisplayType.defaultEditType;
    } else {
      displayType = DisplayType.Input;
    }
    return displayType;
  }

  // 获取详情页显示类型
  public static getPiDetailDisplayType(pi: TsPi): DisplayType {
    let displayType = DisplayType.Text;
    if (pi.isEnum || pi.isKeyvalueItem) {
      displayType = EnumDisplayType.defaultDisplayType;
    } else if (pi.tsType == 'Date') {
      displayType = DateDisplayType.defaultDisplayType;
    } else if (pi.tsType == 'boolean') {
      displayType = BooleanDisplayType.defaultDisplayType;
    } else if (pi.tsType == 'number') {
      displayType = NumberDisplayType.defaultDisplayType;
    } else if (pi.tsType == 'string') {
      displayType = StringDisplayType.defaultDisplayType;
    } else {
      displayType = DisplayType.Text;
    }
    return displayType;
  }

  // 获取查询框显示类型
  public static getPiQueryDisplayTypeList(pi: TsPi): DisplayType[] {
    let displayTypeList: DisplayType[] = [DisplayType.Input];
    if (pi.isEnum || pi.isKeyvalueItem) {
      displayTypeList = EnumDisplayType.getQueryType();
    } else if (pi.tsType == 'Date') {
      displayTypeList = DateDisplayType.getQueryType();
    } else if (pi.tsType == 'boolean') {
      displayTypeList = BooleanDisplayType.getQueryType();
    } else if (pi.tsType == 'number') {
      displayTypeList = NumberDisplayType.getQueryType();
    } else if (pi.tsType == 'string') {
      displayTypeList = StringDisplayType.getQueryType();
    } else {
      displayTypeList = [DisplayType.Input];
    }
    return displayTypeList;
  }

  // 获取Table List 显示类型
  public static getPiListDisplayTypeList(pi: TsPi): DisplayType[] {
    let displayTypeList: DisplayType[] = [DisplayType.Text];
    if (pi.isEnum || pi.isKeyvalueItem) {
      displayTypeList = EnumDisplayType.getDisplayType();
    } else if (pi.tsType == 'Date') {
      displayTypeList = DateDisplayType.getDisplayType();
    } else if (pi.tsType == 'boolean') {
      displayTypeList = BooleanDisplayType.getDisplayType();
    } else if (pi.tsType == 'number') {
      displayTypeList = NumberDisplayType.getDisplayType();
    } else if (pi.tsType == 'string') {
      displayTypeList = StringDisplayType.getDisplayType();
    } else {
      displayTypeList[DisplayType.Text];
    }
    return displayTypeList;
  }

  // 获取编辑显示类型
  public static getPiEditDisplayTypeList(pi: TsPi): DisplayType[] {
    let displayTypeList: DisplayType[] = [DisplayType.Input];
    if (pi.isEnum || pi.isKeyvalueItem) {
      displayTypeList = EnumDisplayType.getEditType();
    } else if (pi.tsType == 'Date') {
      displayTypeList = DateDisplayType.getEditType();
    } else if (pi.tsType == 'boolean') {
      displayTypeList = BooleanDisplayType.getEditType();
    } else if (pi.tsType == 'number') {
      displayTypeList = NumberDisplayType.getEditType();
    } else if (pi.tsType == 'string') {
      displayTypeList = StringDisplayType.getEditType();
    } else {
      displayTypeList = [DisplayType.Input];
    }
    return displayTypeList;
  }

  // 获取详情页显示类型
  public static getPiDetailDisplayTypeList(pi: TsPi): DisplayType[] {
    let displayTypeList: DisplayType[] = [DisplayType.Input];
    if (pi.isEnum || pi.isKeyvalueItem) {
      displayTypeList = EnumDisplayType.getDisplayType();
    } else if (pi.tsType == 'Date') {
      displayTypeList = DateDisplayType.getDisplayType();
    } else if (pi.tsType == 'boolean') {
      displayTypeList = BooleanDisplayType.getDisplayType();
    } else if (pi.tsType == 'number') {
      displayTypeList = NumberDisplayType.getDisplayType();
    } else if (pi.tsType == 'string') {
      displayTypeList = StringDisplayType.getDisplayType();
    } else {
      displayTypeList = [DisplayType.Input];
    }
    return displayTypeList;
  }
}
