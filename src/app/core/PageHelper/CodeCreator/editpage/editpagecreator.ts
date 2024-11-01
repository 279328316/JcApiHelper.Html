import { PageTreeNode, TsModel } from "@models/tsmodel";

export class EditPageCreator {
  
  // 获取编辑页面的节点
  static getEditPageNode(pageBaseModel: TsModel): PageTreeNode {
    let modelId = pageBaseModel.id.toLocaleLowerCase();
    let modelName = pageBaseModel.name.toLocaleLowerCase();
    let editPageNode = <PageTreeNode>{
      title: modelName + "edit",
      key: modelId + "edit",
      expanded: false,
      children: [],
    };

    let editPageHtmlNode = <PageTreeNode>{
      title: modelName + "edit.component.html",
      key: modelId + "edit.component.html",
      isLeaf: true,
    };
    let editPageLessNode = <PageTreeNode>{
      title: modelName + "edit.component.less",
      key: modelId + "edit.component.less",
      isLeaf: true,
    };
    let editPageTsNode = <PageTreeNode>{
      title: modelName + "edit.component.ts",
      key: modelId + "edit.component.ts",
      isLeaf: true,
    };
    editPageNode.children.push(editPageHtmlNode);
    editPageNode.children.push(editPageLessNode);
    editPageNode.children.push(editPageTsNode);
    return editPageNode;
  }
}
