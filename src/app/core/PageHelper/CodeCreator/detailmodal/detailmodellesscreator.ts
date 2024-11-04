import { StringHelper } from '@core/stringhelper';
import { TsModel } from '@models/tsmodel';

export class DetailModalLessCreator {
  // 获取Less代码
  static getDetailModalLessCode(pageBaseModel: TsModel): string {
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
