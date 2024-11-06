import { StringHelper } from '@core/stringhelper';
import { TsModel } from '@models/tsmodel';

export class EditModalLessCreator {
  // 获取Less代码
  static getEditModalLessCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;

    let code = '';
    return code;
  }
}
