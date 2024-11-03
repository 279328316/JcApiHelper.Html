import { PageTreeNode, TsModel } from "@models/tsmodel";
import { ListPageHelper } from "./CodeCreator/listpage/listpagehelper";
import { EditPageCreator } from "./CodeCreator/editpage/editpagecreator";
import { EditModalPageCreator } from "./CodeCreator/editpage/editmodalpagecreator";
import { DetailPageCreator } from "./CodeCreator/detailpage/detailpagecreator";
import { DetailModalPageCreator } from "./CodeCreator/detailpage/detailmodalpagecreator";

export class PageHelper {
  // 生成页面节点
  static generatePageNode(pageBaseModel: TsModel): PageTreeNode {
    if (!pageBaseModel) return null;
    console.log("pageBaseModel", pageBaseModel);
    let modelId = pageBaseModel.id.toLocaleLowerCase();
    let modelName = pageBaseModel.name.toLocaleLowerCase();
    let pageNode = <PageTreeNode>{
      title: modelName,
      key: modelId,
      expanded: true,
      children: [],
    };
    let listPageNode = ListPageHelper.getListPageNode(pageBaseModel);
    let editPageNode = EditPageCreator.getEditPageNode(pageBaseModel);
    let editModalPageNode = EditModalPageCreator.getEditModalPageNode(pageBaseModel);
    let detailPageNode = DetailPageCreator.getDetailPageNode(pageBaseModel);
    let detailModalPageNode = DetailModalPageCreator.getDetailModalPageNode(pageBaseModel);

    pageNode.children.push(listPageNode);
    pageNode.children.push(editPageNode);
    pageNode.children.push(editModalPageNode);
    pageNode.children.push(detailPageNode);
    pageNode.children.push(detailModalPageNode);
    return pageNode;
  }
}
