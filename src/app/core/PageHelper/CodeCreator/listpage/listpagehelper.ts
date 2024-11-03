import { PageTreeNode, TsModel } from "@models/tsmodel";
import { ListPageHtmlCreator } from "./listpagehtmlcreator";
import { ListPageTsCreator } from "./listpagetscreator";

export class ListPageHelper {
  // 获取列表页面的节点
  static getListPageNode(pageBaseModel: TsModel): PageTreeNode {
    let modelId = pageBaseModel.id.toLocaleLowerCase();
    let modelName = pageBaseModel.name.toLocaleLowerCase();
    let listPageNode = <PageTreeNode>{
      title: modelName + "list",
      key: modelId + "list",
      expanded: false,
      children: [],
    };

    let listPageHtmlNode = <PageTreeNode>{
      title: modelName + "list.component.html",
      key: modelId + "list.component.html",
      isLeaf: true,
      code: ListPageHtmlCreator.getListPageHtmlCode(pageBaseModel),
      language: "html",
    };
    let listPageLessNode = <PageTreeNode>{
      title: modelName + "list.component.less",
      key: modelId + "list.component.less",
      isLeaf: true,
      code: '',
      language: "less",
    };
    let listPageTsNode = <PageTreeNode>{
      title: modelName + "list.component.ts",
      key: modelId + "list.component.ts",
      isLeaf: true,
      code: ListPageTsCreator.getListPageTsCode(pageBaseModel),
      language: "typescript",
    };
    listPageNode.children.push(listPageHtmlNode);
    listPageNode.children.push(listPageLessNode);
    listPageNode.children.push(listPageTsNode);
    return listPageNode;
  }
}
