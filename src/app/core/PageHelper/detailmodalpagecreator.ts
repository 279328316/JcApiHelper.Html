import { PageTreeNode, TsModel } from "@models/tsmodel";

export class DetailModalPageCreator {
  
  // 获取详情页面的节点
  static getDetailModalPageNode(pageBaseModel: TsModel): PageTreeNode {
    let modelId = pageBaseModel.id.toLocaleLowerCase();
    let modelName = pageBaseModel.name.toLocaleLowerCase();
    let detailPageNode = <PageTreeNode>{
      title: modelName + "detail_modal",
      key: modelId + "detail_modal",
      expanded: false,
      children: [],
    };
    let detailPageHtmlNode = <PageTreeNode>{
      title: modelName + "detail.component.html",
      key: modelId + "detail_modal.component.html",
      isLeaf: true,
    };
    let detailPageLessNode = <PageTreeNode>{
      title: modelName + "detail.component.less",
      key: modelId + "detail_modal.component.ts",
      isLeaf: true,
    };
    let detailPageTsNode = <PageTreeNode>{
      title: modelName + "detail.component.ts",
      key: modelId + "detail_modal.component.ts",
      isLeaf: true,
    };
    detailPageNode.children.push(detailPageHtmlNode);
    detailPageNode.children.push(detailPageLessNode);
    detailPageNode.children.push(detailPageTsNode);
    return detailPageNode;
  }
}
