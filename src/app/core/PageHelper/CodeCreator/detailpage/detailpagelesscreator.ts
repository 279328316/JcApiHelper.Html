import { StringHelper } from '@core/stringhelper';
import { TsModel } from '@models/tsmodel';

export class DetailPageLessCreator {
  // 获取Less代码
  static getDetailPageLessCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;

    let code = `::ng-deep {
  .ant-switch-loading,
  .ant-switch-disabled {
    cursor: not-allowed;
    opacity: 1;
  }
}
`;
    return code;
  }
}
