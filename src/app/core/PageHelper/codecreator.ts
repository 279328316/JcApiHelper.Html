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

export class CodeCreator {
  // 获取枚举属性初始化代码
  public static getEnumPiInitCode(pi: TsPi): string {
    let piName = StringHelper.firstToLower(pi.name);
    let piClassName = pi.name;
    let piSummary = pi.summary;
    let code = `
  /**
   * 初始化@piSummary
   */
  init@piClassName(): void {
    this.enumSvc.getEnumItem('@piClassName').subscribe((items: EnumItem[]) => {
      this.@piNames = items;
    });
  }`;
    code = code
      .replace(/@piSummary/g, piSummary)
      .replace(/@piName/g, piName)
      .replace(/@piClassName/g, piClassName);
    return code;
  }

  // 获取查询框显示类型
  public static getPiQueryDisplayType(pi: TsPi): DisplayType {
    let displayType = DisplayType.Input;
    if (pi.isEnum) {
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
    if (pi.isEnum) {
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
    if (pi.isEnum) {
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
    if (pi.isEnum) {
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
    if (pi.isEnum) {
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
    if (pi.isEnum) {
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
    if (pi.isEnum) {
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
    if (pi.isEnum) {
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
