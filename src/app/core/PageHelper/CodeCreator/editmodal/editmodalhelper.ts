import { PageTreeNode, TsModel } from '@models/tsmodel';
import { EditModalHtmlCreator } from './editmodalhtmlcreator';
import { EditModalTsCreator } from './editmodaltscreator';

export class EditModalHelper {
  // 获取编辑Modal的节点
  static getEditModalNode(pageBaseModel: TsModel): PageTreeNode {
    let modelId = pageBaseModel.id.toLowerCase();
    let modelName = pageBaseModel.name.toLowerCase();
    let editModalNode = <PageTreeNode>{
      title: modelName + 'editmodal',
      key: modelId + 'editmodal',
      expanded: false,
      children: [],
    };

    let editModalHtmlNode = <PageTreeNode>{
      title: modelName + 'edit.component.html',
      key: modelId + 'editmodal.component.html',
      isLeaf: true,
      code: EditModalHtmlCreator.getEditModalHtmlCode(pageBaseModel),
      language: 'html',
    };
    let editModalLessNode = <PageTreeNode>{
      title: modelName + 'edit.component.less',
      key: modelId + 'editmodal.component.less',
      isLeaf: true,
      code: '',
      language: 'less',
    };
    let editModalTsNode = <PageTreeNode>{
      title: modelName + 'edit.component.ts',
      key: modelId + 'editmodal.component.ts',
      isLeaf: true,
      code: EditModalTsCreator.getEditModalTsCode(pageBaseModel),
      language: 'typescript',
    };
    editModalNode.children.push(editModalHtmlNode);
    editModalNode.children.push(editModalLessNode);
    editModalNode.children.push(editModalTsNode);
    return editModalNode;
  }
}
