import { NzTreeNode } from 'ng-zorro-antd/tree';
import { KeyValueItem, KeyValueObj } from './keyvalue';
import { TsPi } from './propertyinfo';

/*TsResult生成返回对象*/
export class TsResult {
  id: string; // 结果对象Id ControllerId,ActionId,PTypeId
  name: string; // 结果对象名 ControllerName,ActionName,PTypeName
  summary: string; // summary 描述备注
  tsModelList: TsModel[]; // 类属性列表
  tsCode: TsCode; // TsService
}

export enum PageType {
  Page = 'Page', // 界面
  Modal = 'Modal', // 弹窗
}

/*TsModel*/
export class TsModel {
  id: string; // PTypeId
  name: string; // 参数名
  summary: string; // Summary
  piList: TsPi[]; // 类属性列表
  editPageType: PageType; // 编辑显示类型
  detailPageType: PageType; // 详情显示类型
}

export class PageTreeNode extends NzTreeNode {
  language: string;
  code: string;
  expanded: boolean;
}

/*TsCode Model*/
export class TsCode {
  tsModelCode: string; // Jc Service Code
  tsServiceCode: string; // Common Service Code
  apiCode: string; // Common Service Code
}
