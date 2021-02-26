import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '@pages/workbench/service/api.service';
import {Action, ParamModel, PTypeModel} from '@pages/workbench/service/api';
import {Util} from '@core/util';

@Component({
  selector: 'app-action', templateUrl: './action.component.html', styleUrls: ['./action.component.less']
})
export class ActionComponent implements OnInit {
  actionId: string;
  action: Action;

  tagcolor: string[] = ['cyan', 'geekblue', 'blue', 'purple'];
  inputParams: ParamModel[] = [];
  returnParams: ParamModel[] = [];

  constructor(private routerParams: ActivatedRoute, private apiSvc: ApiService) {
  }

  ngOnInit() {
    this.actionId = this.routerParams.snapshot.paramMap.get('actionId');
    this.getAction();
  }

  /*获取Action*/
  getAction() {
    this.apiSvc.getAction(this.actionId).subscribe((action: Action) => {
      this.action = action;
      let title = action.controllerName + '/' + action.actionName + " - Api Helper";
      Util.setTitle(title);
      if (action && action.inputParameters) { //处理输入参数
        action.inputParameters.forEach((param) => {
          if (param.hasPiList && !param.isEnum) {
            this.apiSvc.getPType(param.typeId).subscribe((ptype: PTypeModel) => {
              ptype.piList.forEach(pi => {
                if (this.inputParams.filter(a => a.name == pi.name).length <= 0) {
                  this.inputParams.push(pi);
                }
              });
            });
          } else {
            this.inputParams.push(param);
          }
        });
      }
      if (action && action.returnParameter) { //处理返回参数
        if (action.returnParameter.hasPiList && !action.returnParameter.isEnum) {
          this.apiSvc.getPType(action.returnParameter.typeId).subscribe((ptype: PTypeModel) => {
            this.returnParams = ptype.piList;
          });
        } else {
          this.returnParams.push(action.returnParameter);
        }
      }
    });
  }

  /* name参数排序 */
  nameSortFn(a: any, b: any, sortOrder: string) {
    return a['name'].localeCompare(b['name']);
  }

  /* type参数排序 */
  typeSortFn(a: any, b: any, sortOrder: string) {
    return a['typeName'].localeCompare(b['typeName']);
  }
}
