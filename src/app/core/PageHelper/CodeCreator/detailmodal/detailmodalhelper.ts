import { PageTreeNode, TsModel } from '@models/tsmodel';
import { DetailModalHtmlCreator } from './detailmodalhtmlcreator';
import { DetailModalTsCreator } from './detailmodaltscreator';
import { DetailModalLessCreator } from './detailmodallesscreator';

export class DetailModalHelper {
  // 获取编辑Modal的节点
  static getDetailModalNode(pageBaseModel: TsModel): PageTreeNode {
    let modelId = pageBaseModel.id.toLowerCase();
    let modelName = pageBaseModel.name.toLowerCase();
    let detailModalNode = <PageTreeNode>{
      title: modelName + 'detailmodal',
      key: modelId + 'detailmodal',
      expanded: false,
      children: [],
    };

    let detailModalHtmlNode = <PageTreeNode>{
      title: modelName + 'detail.component.html',
      key: modelId + 'detailmodal.component.html',
      isLeaf: true,
      code: DetailModalHtmlCreator.getDetailModalHtmlCode(pageBaseModel),
      language: 'html',
    };
    let detailModalLessNode = <PageTreeNode>{
      title: modelName + 'detail.component.less',
      key: modelId + 'detailmodal.component.less',
      isLeaf: true,
      code: DetailModalLessCreator.getDetailModalLessCode(pageBaseModel),
      language: 'less',
    };
    let detailModalTsNode = <PageTreeNode>{
      title: modelName + 'detail.component.ts',
      key: modelId + 'detailmodal.component.ts',
      isLeaf: true,
      code: DetailModalTsCreator.getDetailModalTsCode(pageBaseModel),
      language: 'typescript',
    };
    detailModalNode.children.push(detailModalHtmlNode);
    detailModalNode.children.push(detailModalLessNode);
    detailModalNode.children.push(detailModalTsNode);
    return detailModalNode;
  }
}
