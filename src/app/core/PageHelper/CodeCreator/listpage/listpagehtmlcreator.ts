import { PageTreeNode, TsModel, TsPi } from "@models/tsmodel";

export class ListPageHtmlCreator {
  // 获取列表页面的html代码
  static getListPageHtmlCode(pageBaseModel: TsModel): string {
    let modelId = pageBaseModel.id.toLocaleLowerCase();
    let modelName = pageBaseModel.name.toLocaleLowerCase();
    let title = pageBaseModel.summary ?? pageBaseModel.name;

    let htmlCode = "";
    return htmlCode;
  }

  // 获取查询表单的html代码
  private static getQueryFormCode(pageBaseModel: TsModel): string {
    let queryFormCode = `
        <form nz-form>
            <div nz-row [nzGutter]="24" class="lastrow">
                <div nz-col [nzSpan]="6">
                    <nz-form-item>
                        <nz-form-label class="w80">名称</nz-form-label>
                        <nz-form-control>
                            <input nz-input name="name" [(ngModel)]="queryObj.name" placeholder="请输入名称" />
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6">
                    <nz-form-item>
                        <nz-form-label class="w100">AppCode</nz-form-label>
                        <nz-form-control>
                            <input name="code" nz-input [(ngModel)]="queryObj.code" placeholder="请输入AppCode" />
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6">
                    <nz-form-item>
                        <nz-form-label class="w80">操作系统</nz-form-label>
                        <nz-form-control>
                            <nz-select name="osType" [(ngModel)]="queryObj.osType" nzAllowClear
                                nzPlaceHolder="-- 请 选 择 --">
                                <nz-option *ngFor="let os of osTypes" [nzValue]="os.value"
                                    [nzLabel]="os.displayName"></nz-option>
                            </nz-select>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6">
                    <button class="ml30 w120" nz-button [nzLoading]="loading" [nzType]="'primary'"
                        (click)="queryAppList(true)" type="submit">查询</button>
                </div>
            </div>
        </form>
      `;
    return queryFormCode;
  }

  // 获取查询参数项的html代码
  private static getQueryItemCode(pageBaseModel: TsModel, pi: TsPi): string {
    let queryItemCode = "";
    let modelName = pageBaseModel.name.toLocaleLowerCase();
    let piName = pi.name;
    let piSummary = pi.summary;

    if (pi.isEnum) {
      queryItemCode = `
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
                </div>
          `;
    } else if (pi.tsType == "bool") {
      queryItemCode = `
                <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="10" [nzLg]="10">
                    <nz-form-item>
                        <nz-form-label class="w80">@piSummary</nz-form-label>
                        <nz-form-control>
                            <nz-radio-group name="versionStatus" [(ngModel)]="queryObj.versionStatus"
                                (ngModelChange)="query@modelNameList(true)">
                                <label nz-radio [nzValue]="null">全部</label>
                                <label nz-radio [nzValue]="true">是</label>
                                <label nz-radio [nzValue]="false">否</label>
                            </nz-radio-group>
                        </nz-form-control>
                    </nz-form-item>
                </div>
          `;
    }
    return queryItemCode;
  }

  /**
   * 获取HTML模板字符串
   *
   * @returns 返回HTML模板字符串
   */
  private static getHtmlTemplate(): string {
    let htmlTemplate = `
<div>
    <nz-page-header class="contentPageHeader">
        <nz-page-header-subtitle>@title</nz-page-header-subtitle>
        <nz-page-header-extra>
            <button nz-button [nzType]="'primary'" (click)="add@modelName()">新增</button>
        </nz-page-header-extra>
    </nz-page-header>
    <!--Content-->
    <nz-card>
        @queryItem
    </nz-card>
    <nz-card class="mt5">
        <nz-table #appTable nzSize='default' [nzFrontPagination]='false' nzShowSizeChanger [nzData]='appList'
            [nzLoading]='loading' [nzTotal]="totalCount" [nzShowTotal]="totalTemplate"
            [nzPageIndex]="queryObj.pageIndex" [nzPageSize]="queryObj.pageSize"
            (nzQueryParams)="onQueryParamsChange($event)">
            <thead>
                <tr>
                    <th nz-th [nzSortFn]="true" nzColumnKey="name">名称</th>
                    <th nz-th [nzSortFn]="true" nzColumnKey="code">Code</th>
                    <th nz-th [nzSortFn]="true" nzColumnKey="ostype">OSType</th>
                    <th nz-th nzWidth="150">备注</th>
                    <th nz-th>最新版本</th>
                    <th nz-th>最后修改人</th>
                    <th nz-th [nzSortFn]="true" nzColumnKey="lastUpdateDate">修改时间</th>
                    <th nz-th>操作</th>
                </tr>
            </thead>
            <tbody>
                @for (app of appList; track $index) {
                <tr>
                    <td>
                        <a (click)="viewApp(app)">{{ app.name }}</a>
                    </td>
                    <td>{{ app.code }}</td>
                    <td>{{ app.osTypeName }}</td>
                    <td>{{ app.note }}</td>
                    <td>{{ app.lastestVersion }}</td>
                    <td>{{ app.lastUpdateUserName }}</td>
                    <td>{{ app.lastUpdateDate | date:'yyyy-MM-dd HH:mm' }}</td>
                    <td>
                        <a (click)="viewApp(app)">查看</a>
                        <a (click)="editApp(app)" class="ml10">编辑</a>
                    </td>
                </tr>
                }
            </tbody>
            <ng-template #totalTemplate let-total>
                <span class="mr10">共 {{ total }} 条记录</span>
            </ng-template>
        </nz-table>
    </nz-card>
</div>
        `;
    return htmlTemplate;
  }
}
