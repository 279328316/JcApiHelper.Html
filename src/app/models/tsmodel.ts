
/*TsResult生成返回对象*/
export class TsResult {
  id: string; // 结果对象Id ControllerId,ActionId,PTypeId
  name: string; // 结果对象名 ControllerName,ActionName,PTypeName
  summary: string; // summary 描述备注
  tsModelList: TsModel[]; // 类属性列表
  tsCode: TsCode; // TsService
}

/*TsModel*/
export class TsModel {
  id: string; // PTypeId
  name: string; // 参数名
  summary: string; // Summary
  piList: TsPi[]; // 类属性列表
}

/*TsPiModel*/
export class TsPi {
  name: string; // 参数名
  isSelected: boolean; // 是否选中
  tsType: string; // Ts参数类型
  summary: string; // Summary
}

/*TsCode Model*/
export class TsCode {
  tsModelCode: string; // Jc Service Code
  tsServiceCode: string; // Common Service Code
  apiCode: string; // Common Service Code
}
