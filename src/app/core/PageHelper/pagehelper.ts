import { PageTreeNode, TsModel } from '@models/tsmodel';
import { ListPageHelper } from './CodeCreator/listpage/listpagehelper';
import { EditPageHelper } from './CodeCreator/editpage/editpagehelper';
import { EditModalHelper } from './CodeCreator/editmodal/editmodalhelper';
import { DetailPageHelper } from './CodeCreator/detailpage/detailpagehelper';
import { DetailModalHelper } from './CodeCreator/detailmodal/detailmodalhelper';

export class PageHelper {
  // 生成页面节点
  static generatePageNode(pageBaseModel: TsModel): PageTreeNode {
    if (!pageBaseModel) return null;
    let modelId = pageBaseModel.id.toLocaleLowerCase();
    let modelName = pageBaseModel.name.toLocaleLowerCase();
    let pageNode = <PageTreeNode>{
      title: modelName,
      key: modelId,
      expanded: true,
      children: [],
    };
    let listPageNode = ListPageHelper.getListPageNode(pageBaseModel);
    let editPageNode = EditPageHelper.getEditPageNode(pageBaseModel);
    let editModalNode = EditModalHelper.getEditModalNode(pageBaseModel);
    let detailPageNode = DetailPageHelper.getDetailPageNode(pageBaseModel);
    let detailModalNode = DetailModalHelper.getDetailModalNode(pageBaseModel);

    pageNode.children.push(listPageNode);
    pageNode.children.push(editPageNode);
    pageNode.children.push(editModalNode);
    pageNode.children.push(detailPageNode);
    pageNode.children.push(detailModalNode);
    return pageNode;
  }
}
