import { StringHelper } from '@core/stringhelper';
import { DisplayType, TsPi } from '@models/propertyinfo';
import { TsModel } from '@models/tsmodel';

export class DetailPageHtmlCreator {
  // 获取详情页面的html代码
  static getDetailPageHtmlCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = !pageBaseModel.summary ? modelName : pageBaseModel.summary;
    let htmlCode = '';
    let htmlTemplate = `<nz-page-header>
    <nz-page-header-subtitle>应用详情--{{@modelName.name}}</nz-page-header-subtitle>
    <nz-page-header-extra>
        <button nz-button class="w100 mr30" [nzType]="'primary'" (click)="edit@modelClassName()">编辑</button>
        <button nz-button class="w100 mr30" [nzType]="'primary'" nzGhost nzDanger (click)="delete@modelClassName()">删除</button>
        <button nz-button class="w80 mr30" [nzType]="'primary'" nzGhost (click)="back()">返回</button>
        <button nz-button nzType="primary" nzGhost nz-dropdown [nzDropdownMenu]="menu" nzDropdownTrigger="click">
            ...
        </button>
        <nz-dropdown-menu #menu="nzDropdownMenu">
            <ul nz-menu class="minw100">
                <li nz-menu-item (click)="back()">更多</li>
            </ul>
        </nz-dropdown-menu>
    </nz-page-header-extra>
</nz-page-header>
<nz-card class="minh360">
    <div nz-row>
        <div nz-col [nzSpan]="24">
            <label>基本信息</label>
        </div>
    </div>
    <div class="ml10">
        @detailCode
    </div>
</nz-card>`;
    let detailCode = this.getDetailCode(pageBaseModel);
    htmlCode = htmlTemplate
      .replace(/@modelName/g, modelName)
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@modelSummary/g, modelSummary)
      .replace(/@detailCode/g, detailCode);
    return htmlCode;
  }

  // 获取详情的html代码
  private static getDetailCode(pageBaseModel: TsModel): string {
    let detailCode = '';
    let detailPiIndex = 0;
    let detailPiList = pageBaseModel.piList.filter((pi) => pi.isDetail);
    for (let pi of detailPiList) {
      let piCode = this.getDetailItemCode(pageBaseModel, pi);
      if (detailPiIndex % 3 == 0) {
        detailCode += `\n        <div nz-row [nzGutter]="32" class="mt20">`;
      }
      detailCode += piCode;
      if (detailPiIndex % 3 == 2 || detailPiIndex == detailPiList.length - 1) {
        detailCode += `\n        </div>`;
      }
      detailPiIndex++;
    }
    return detailCode;
  }

  // 获取详情Item的html代码
  private static getDetailItemCode(pageBaseModel: TsModel, pi: TsPi): string {
    let itemCode = '';
    let itemCodeTemplate = '';
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let piName = StringHelper.firstToLower(pi.name);
    let piSummary = !pi.summary ? piName : pi.summary;
    if (pi.detailDisplayType == DisplayType.Text) {
      if (pi.tsType == 'Date') {
        itemCodeTemplate = `
            <div nz-col [nzSpan]="6">
                <label class="w100">@piSummary</label>
                <span>{{ @modelName.@piName | date:'yyyy-MM-dd HH:mm:ss' }}</span>
            </div>`;
      } else {
        itemCodeTemplate = `
            <div nz-col [nzSpan]="6">
                <label class="w100">@piSummary</label>
                <span>{{ @modelName.@piName }}</span>
            </div>`;
      }
    } else if (pi.detailDisplayType == DisplayType.Tag) {
      itemCodeTemplate = `
            <div nz-col [nzSpan]="6">
                <label class="w100">@piSummary</label>
                <nz-tag [nzColor]="'cyan'">{{ @modelName.@piName }}</nz-tag>
            </div>`;
    } else if (pi.detailDisplayType == DisplayType.Pre) {
      itemCodeTemplate = `
            <div nz-col [nzSpan]="6">
                <label class="w100">@piSummary</label>
                <pre>{{ @modelName.@piName }}</pre>
            </div>`;
    } else if (pi.detailDisplayType == DisplayType.ProgressBar) {
      itemCodeTemplate = `
            <div nz-col [nzSpan]="6">
                <label class="w100">@piSummary</label>
                <nz-progress [nzPercent]="@modelName.@piName"></nz-progress>
            </div>`;
    } else if (pi.detailDisplayType == DisplayType.Rate) {
      itemCodeTemplate = `
            <div nz-col [nzSpan]="6">
                <label class="w100">@piSummary</label>
                <nz-rate [ngModel]="@modelName.@piName" nzAllowHalf nzDisabled></nz-rate>
            </div>`;
    } else if (pi.detailDisplayType == DisplayType.Switch) {
      itemCodeTemplate = `
            <div nz-col [nzSpan]="6">
                <label class="w100">@piSummary</label>
                <nz-switch [ngModel]="@modelName.@piName" nzDisabled></nz-switch>
            </div>`;
    } else if (pi.detailDisplayType == DisplayType.Checkbox) {
      itemCodeTemplate = `
            <div nz-col [nzSpan]="6">
                <label class="w100">@piSummary</label>
                <label nz-checkbox [ngModel]="@modelName.@piName" nzDisabled></label>
            </div>`;
    }
    itemCode = itemCodeTemplate
      .replace(/@modelName/g, modelName)
      .replace(/@piName/g, piName)
      .replace(/@piSummary/g, piSummary);
    return itemCode;
  }
}
