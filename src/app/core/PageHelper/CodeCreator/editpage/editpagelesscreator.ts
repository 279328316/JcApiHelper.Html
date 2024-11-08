import { StringHelper } from '@core/stringhelper';
import { TsModel } from '@models/tsmodel';

export class EditPageLessCreator {
  // 获取Less代码
  static getEditPageLessCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;

    let code = '';
    return code;
  }
}
