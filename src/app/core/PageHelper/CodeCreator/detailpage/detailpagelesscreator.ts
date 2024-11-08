import { StringHelper } from '@core/stringhelper';
import { DisplayType } from '@models/propertyinfo';
import { TsModel } from '@models/tsmodel';

export class DetailPageLessCreator {
  // 获取Less代码
  static getDetailPageLessCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;

    let code = `::ng-deep {
@ngcss
}`;
    let ngcss = '';
    let piList = pageBaseModel.piList;
    if (piList.filter((pi) => pi.isDetail && pi.detailDisplayType == DisplayType.Switch).length > 0) {
      ngcss += `
  .ant-switch-loading,
  .ant-switch-disabled {
    cursor: not-allowed;
    opacity: 1;
  }
`;
    }
    if (piList.filter((pi) => pi.isDetail && pi.detailDisplayType == DisplayType.Checkbox).length > 0) {
      ngcss += `
  .ant-checkbox-disabled .ant-checkbox-inner {
    background-color: #fff !important;
    border-color: var(--ant-primary-color) !important;
  }
  .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: var(--ant-primary-color);
  }
`;
    }
    code = code.replace(/@ngcss/g, ngcss);
    return code;
  }
}
