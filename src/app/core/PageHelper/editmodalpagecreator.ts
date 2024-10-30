import { PageTreeNode, TsModel } from "@models/tsmodel";

export class EditModalPageCreator {
  
  // 获取编辑页面的节点
  static getEditModalPageNode(pageBaseModel: TsModel): PageTreeNode {
    let modelId = pageBaseModel.id.toLocaleLowerCase();
    let modelName = pageBaseModel.name.toLocaleLowerCase();
    let editPageNode = <PageTreeNode>{
      title: modelName + "edit_modal",
      key: modelId + "edit_modal",
      expanded: false,
      children: [],
    };
    let editPageHtmlNode = <PageTreeNode>{
      title: modelName + "edit.component.html",
      key: modelId + "edit_modal.component.html",
      isLeaf: true,
    };
    let editPageLessNode = <PageTreeNode>{
      title: modelName + "edit.component.less",
      key: modelId + "edit_modal.component.less",
      isLeaf: true,
    };
    let editPageTsNode = <PageTreeNode>{
      title: modelName + "edit.component.ts",
      key: modelId + "edit_modal.component.ts",
      isLeaf: true,
    };
    editPageNode.children.push(editPageHtmlNode);
    editPageNode.children.push(editPageLessNode);
    editPageNode.children.push(editPageTsNode);
    return editPageNode;
  }
}
