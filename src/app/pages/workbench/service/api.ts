
// Area
export class Area {
  isSelected: boolean; // 是否选中
  areaName: string;   // Area名称
  displayName: string; // 显示名称
}

// Controller
export class Controller {
  id: string;   // Id
  isSelected: boolean; // 是否选中
  areaName: string;   // Area名称
  controllerName: string;   // Controller名称
  summary: string;   // 注释,说明
  customerAttrList: CustomerAttr[];   // 特性
  actionList: Action[];   // ActionList
}

// Action
export class Action {
  id: string;   // Id
  areaName: string;   // areaName名称
  controllerName: string;   // Controller名称
  actionName: string;   // actionName名称
  summary: string;   // 注释,说明
  customerAttrList: CustomerAttr[];   // 特性
  inputParameters: ParamModel[];   // 输入参数
  returnParameter: ParamModel;   // 返回参数
}

// CustomerAttr
export class CustomerAttr {
  name: string;   // Name名称
  typeId: string;   // 类型Id
  typeName: string;   // 类型名称
  hasPiList: boolean;   // 是否包含属性
  summary: string;   // 注释,说明
  position: number;   // 参数位置
  constructorArgumentsList: ParamModel[];   // ConstructorArguments参数列表
  namedArgumentsList: ParamModel[];   // NamedArguments 参数列表
}

// ParamModel
export class ParamModel {
  id: string;   // Id
  name: string;   // Name名称
  typeId: string;   // 类型Id
  typeName: string;   // 类型名称
  hasPiList: boolean;   // 是否包含属性
  isEnum: boolean;   // 是否枚举类型
  isGeneric: boolean;   // 是否为泛型
  isIEnumerable: boolean;   // 是否实现了IEnumerable接口
  enumItemId: string;   // 枚举Item类型Id
  enumItemName: string;   // 枚举Item类型Name
  summary: string;   // 注释,说明
  paramValue: string;   // 参数值
  position: number;   // 参数位置
  isOptional: boolean;   // 是否可选
  defaultValue: string;   // 默认值
}

// PTypeModel
export class PTypeModel {
  id: string;   // Id
  typeName: string;   // 类型名称
  isEnum: boolean;   // 是否枚举类型
  isGeneric: boolean;   // 是否为泛型
  isIEnumerable: boolean;   // 是否实现了IEnumerable接口
  enumItemId: string;   // 枚举Item类型Id
  enumItemName: string;   // 枚举Item类型Name
  summary: string;   // 注释,说明
  piList: ParamModel[];   // NamedArguments 参数列表
}
