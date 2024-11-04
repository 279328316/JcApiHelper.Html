import { PageTreeNode, TsModel } from '@models/tsmodel';
import { EditPageHtmlCreator } from './editpagehtmlcreator';
import { EditPageTsCreator } from './editpagetscreator';

export class EditPageHelper {
  // 获取编辑页面的节点
  static getEditPageNode(pageBaseModel: TsModel): PageTreeNode {
    let modelId = pageBaseModel.id.toLowerCase();
    let modelName = pageBaseModel.name.toLowerCase();
    let editPageNode = <PageTreeNode>{
      title: modelName + 'edit',
      key: modelId + 'edit',
      expanded: false,
      children: [],
    };

    let editPageHtmlNode = <PageTreeNode>{
      title: modelName + 'edit.component.html',
      key: modelId + 'edit.component.html',
      isLeaf: true,
      code: EditPageHtmlCreator.getEditPageHtmlCode(pageBaseModel),
      language: 'html',
    };
    let editPageLessNode = <PageTreeNode>{
      title: modelName + 'edit.component.less',
      key: modelId + 'edit.component.less',
      isLeaf: true,
      code: '',
      language: 'less',
    };
    let editPageTsNode = <PageTreeNode>{
      title: modelName + 'edit.component.ts',
      key: modelId + 'edit.component.ts',
      isLeaf: true,
      code: EditPageTsCreator.getEditPageTsCode(pageBaseModel),
      language: 'typescript',
    };
    editPageNode.children.push(editPageHtmlNode);
    editPageNode.children.push(editPageLessNode);
    editPageNode.children.push(editPageTsNode);
    return editPageNode;
  }
}
