import { StringHelper } from '@core/stringhelper';
import { TsModel, TsPi } from '@models/tsmodel';

export class ListPageHtmlCreator {
  // 获取列表页面的html代码
  static getListPageHtmlCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;
    let htmlCode = '';
    let htmlTemplate = `<div>
    <nz-page-header class="contentPageHeader">
        <nz-page-header-subtitle>@modelSummary</nz-page-header-subtitle>
        <nz-page-header-extra>
            <button nz-button [nzType]="'primary'" (click)="add@modelName()">新增</button>
        </nz-page-header-extra>
    </nz-page-header>
    <!--Content-->
    <nz-card [nzSize]="'small'">
        @queryFormCode
    </nz-card>
    <nz-card class="mt5">
        @tableListCode
    </nz-card>
</div>`;
    let queryFormCode = this.getQueryFormCode(pageBaseModel);
    let tableListCode = this.getTableListCode(pageBaseModel);

    htmlCode = htmlTemplate
      .replace(/@modelName/g, modelName)
      .replace(/@modelSummary/g, modelSummary)
      .replace(/@queryFormCode/g, queryFormCode)
      .replace(/@tableListCode/g, tableListCode);
    return htmlCode;
  }

  // 获取查询表单的html代码
  private static getQueryFormCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;
    let queryFormCode = '';
    let queryFormTemplate = `<form nz-form>
            <div class="pt24">@queryItemCode
            </div>
            <div *ngIf="isShowMore">@queryMoreItemCode
            </div>
            <div nz-row>
                <div nz-col [nzSpan]="24" class="tar">
                    <button nz-button [nzType]="'primary'" (click)="query@modelClassNameList(true)">查询</button>
                    <button nz-button (click)="resetForm()" class="ml20 mr20">重置</button>
                    <a class="collapse" (click)="isShowMore = !isShowMore">
                        {{ isShowMore ? '收起' : '高级' }}
                        <span nz-icon [nzType]="isShowMore ? 'up' : 'down'"></span>
                    </a>
                </div>
            </div>
        </form>`;
    let queryPiIndex = 0;
    let queryPiList = pageBaseModel.piList.filter((pi) => pi.isQuery);
    let queryItemCode = '';
    let queryMoreItemCode = '';
    for (let pi of queryPiList) {
      let piCode = this.getQueryItemCode(pageBaseModel, pi);
      if (queryPiIndex <= 5) {
        if (queryPiIndex % 3 == 0) {
          queryItemCode += `\n                <div nz-row [nzGutter]="24">`;
        }
        queryItemCode += piCode;
        if (queryPiIndex % 3 == 2 || queryPiIndex == queryPiList.length - 1) {
          queryItemCode += `\n                </div>`;
        }
      } else {
        if (queryPiIndex % 3 == 0) {
          queryMoreItemCode += '\n                <div nz-row [nzGutter]="24">';
        }
        queryMoreItemCode += piCode;
        if (queryPiIndex % 3 == 2 || queryPiIndex == queryPiList.length - 1) {
          queryMoreItemCode += `\n                </div>`;
        }
      }
      queryPiIndex++;
    }
    queryFormCode = queryFormTemplate
      .replace(/@queryItemCode/g, queryItemCode)
      .replace(/@queryMoreItemCode/g, queryMoreItemCode)
      .replace(/@modelClassName/g, modelClassName);
    return queryFormCode;
  }

  // 获取查询参数项的html代码
  private static getQueryItemCode(pageBaseModel: TsModel, pi: TsPi): string {
    let queryCode = '';
    let queryCodeTemplate = '';
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;
    let piName = StringHelper.firstToLower(pi.name);
    let piSummary = pi.summary ?? piName;

    if (pi.isEnum) {
      queryCodeTemplate = `
                    <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6">
                        <nz-form-item>
                            <nz-form-label class="w80">@piSummary</nz-form-label>
                            <nz-form-control>
                                <nz-select name="@piName" [(ngModel)]="queryObj.@piName" nzAllowClear
                                    nzPlaceHolder="-- 请 选 择 --">
                                    <nz-option *ngFor="let @piName of @piNames" [nzValue]="@piName.value"
                                        [nzLabel]="@piName.displayName"></nz-option>
                                </nz-select>
                            </nz-form-control>
                        </nz-form-item>
                    </div>`;
    } else if (pi.tsType == 'boolean') {
      queryCodeTemplate = `<div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="10" [nzLg]="10">
                        <nz-form-item>
                            <nz-form-label class="w80">@piSummary</nz-form-label>
                            <nz-form-control>
                                <nz-radio-group name="@piName" [(ngModel)]="queryObj.@piName"
                                    (ngModelChange)="query@modelClassNameList(true)">
                                    <label nz-radio [nzValue]="null">全部</label>
                                    <label nz-radio [nzValue]="true">是</label>
                                    <label nz-radio [nzValue]="false">否</label>
                                </nz-radio-group>
                            </nz-form-control>
                        </nz-form-item>
                    </div>`;
    } else if (pi.tsType == 'Date') {
      queryCodeTemplate = `
                    <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="8">
                        <nz-form-item>
                            <nz-form-label class="w80">@piSummary</nz-form-label>
                            <nz-form-control>
                                <nz-range-picker name="@piName"
                                    [(ngModel)]="queryObj.@piNameRange"></nz-range-picker>
                            </nz-form-control>
                        </nz-form-item>
                    </div>`;
    } else {
      queryCodeTemplate = `
                    <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="8">
                        <nz-form-item>
                            <nz-form-label class="w80">@piName</nz-form-label>
                            <nz-form-control>
                                <nz-input-group [nzSuffix]="inputClearTpl">
                                    <input nz-input name="@piName" [(ngModel)]="queryObj.@piName"
                                        placeholder="请输入@piSummary" />
                                </nz-input-group>
                                <ng-template #inputClearTpl>
                                    @if (queryObj.@piName) {
                                    <span nz-icon class="ant-input-clear-icon" nzTheme="fill" nzType="close-circle"
                                        (click)="queryObj.@piName = null"></span>
                                    }
                                </ng-template>
                            </nz-form-control>
                        </nz-form-item>
                    </div>`;
    }
    queryCode = queryCodeTemplate
      .replace(/@modelClassName/g, modelClassName)
      .replace(/@piName/g, piName)
      .replace(/@piSummary/g, piSummary);
    return queryCode;
  }

  // 获取结果列表的html代码
  private static getTableListCode(pageBaseModel: TsModel): string {
    let modelName = StringHelper.firstToLower(pageBaseModel.name);
    let modelClassName = pageBaseModel.name;
    let modelSummary = pageBaseModel.summary ?? modelName;
    let tableListCode = `<nz-table #@modelName nzSize='default' [nzFrontPagination]='false' nzShowSizeChanger [nzData]='@modelNameList'
          [nzLoading]='loading' [nzTotal]="totalCount" [nzShowTotal]="totalTemplate"
          [nzPageIndex]="queryObj.pageIndex" [nzPageSize]="queryObj.pageSize"
          (nzQueryParams)="onQueryParamsChange($event)">
          <thead>
              <tr>@theadListCode
              </tr>
          </thead>
          <tbody>
              @for (@modelName of @modelNameList; track $index) {
              <tr>@tbodyListCode
              </tr>
              }
          </tbody>
          <ng-template #totalTemplate let-total>
              <span class="mr10">共 {{ total }} 条记录</span>
          </ng-template>
      </nz-table>`;
    let piList = pageBaseModel.piList.filter((pi) => pi.isList);
    let theadListCode = '';
    let tbodyListCode = '';
    for (let pi of piList) {
      let piName = StringHelper.firstToLower(pi.name);
      let piSummary = pi.summary ?? piName;
      let isSort = pi.isListSort;
      let theadCode = `
                <th nz-th${isSort ? ' [nzSortFn]="true" nzColumnKey="@piName"' : ''}>@piSummary</th>`;
      let tbodyCode = `
                <td>{{ @modelName.@piName }}</td>`;
      if (pi.tsType == 'Date') {
        tbodyCode = `
                <td>{{ @modelName.@piName | date:'yyyy-MM-dd HH:mm:ss' }}</td>`;
      }
      theadCode = theadCode.replace(/@piName/g, piName).replace(/@piSummary/g, piSummary);
      tbodyCode = tbodyCode.replace(/@modelName/g, modelName).replace(/@piName/g, piName);
      theadListCode += theadCode;
      tbodyListCode += tbodyCode;
    }
    let opHead = `
                <th nz-th>操作</th>`;
    let opBody = `
                <td>
                    <a (click)="view@modelClassName(@modelName)">查看</a>
                    <a (click)="edit@modelClassName(@modelName)" class="ml10">编辑</a>
                    <a (click)="delete@modelClassName(@modelName)" class="ml10" [nzType]="'danger'">删除</a>
                </td>`;
    theadListCode += opHead;
    tbodyListCode += opBody;

    tableListCode = tableListCode.replace('@theadListCode', theadListCode);
    tableListCode = tableListCode.replace('@tbodyListCode', tbodyListCode);
    tableListCode = tableListCode.replace(/@modelName/g, modelName);
    tableListCode = tableListCode.replace(/@modelClassName/g, modelClassName);
    return tableListCode;
  }
}
