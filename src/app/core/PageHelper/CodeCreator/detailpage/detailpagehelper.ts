import { PageTreeNode, TsModel } from '@models/tsmodel';
import { DetailPageHtmlCreator } from './detailpagehtmlcreator';
import { DetailPageTsCreator } from './detailpagetscreator';
import { DetailPageLessCreator } from './detailpagelesscreator';

export class DetailPageHelper {
  // 获取编辑页面的节点
  static getDetailPageNode(pageBaseModel: TsModel): PageTreeNode {
    let modelId = pageBaseModel.id.toLowerCase();
    let modelName = pageBaseModel.name.toLowerCase();
    let detailPageNode = <PageTreeNode>{
      title: modelName + 'detail',
      key: modelId + 'detail',
      expanded: false,
      children: [],
    };

    let detailPageHtmlNode = <PageTreeNode>{
      title: modelName + 'detail.component.html',
      key: modelId + 'detail.component.html',
      isLeaf: true,
      code: DetailPageHtmlCreator.getDetailPageHtmlCode(pageBaseModel),
      language: 'html',
    };
    let detailPageLessNode = <PageTreeNode>{
      title: modelName + 'detail.component.less',
      key: modelId + 'detail.component.less',
      isLeaf: true,
      code: DetailPageLessCreator.getDetailPageLessCode(pageBaseModel),
      language: 'less',
    };
    let detailPageTsNode = <PageTreeNode>{
      title: modelName + 'detail.component.ts',
      key: modelId + 'detail.component.ts',
      isLeaf: true,
      code: DetailPageTsCreator.getDetailPageTsCode(pageBaseModel),
      language: 'typescript',
    };
    detailPageNode.children.push(detailPageHtmlNode);
    detailPageNode.children.push(detailPageLessNode);
    detailPageNode.children.push(detailPageTsNode);
    return detailPageNode;
  }
}
