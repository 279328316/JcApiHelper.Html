import { Component, OnInit } from '@angular/core';
import {ParamModel, PTypeModel} from "@pages/workbench/service/api";
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "@pages/workbench/service/api.service";
import {Util} from "@core/util";

@Component({
  selector: 'app-ptype',
  templateUrl: './ptype.component.html',
  styleUrls: ['./ptype.component.less']
})
export class PTypeComponent implements OnInit {

  ptypeId: string;
  ptype: PTypeModel;

  constructor(private routerParams: ActivatedRoute, private apiSvc: ApiService) {

  }

  ngOnInit() {
    this.routerParams.params.subscribe((params)=> {
      this.ptypeId = params['ptypeId'];
      this.getPType();
    });
  }

  /*获取PType*/
  getPType () {
    this.apiSvc.getPType(this.ptypeId).subscribe((ptype: PTypeModel) => {
      this.ptype = ptype;
      let title = ptype.typeName + " - Api Helper";
      Util.setTitle(title);
    });
  }
  /*查看类型*/
  viewPType(param:ParamModel){
    Util.goTo('/workbench/ptype/' + (param.isIEnumerable ? param.enumItemId : param.typeId), { replaceUrl: true });

    //相同路由跳转后,需要手动pushState到History 否则浏览器后退功能无该页面.
    history.pushState(null,null,location.href);
  }

  /* name参数排序 */
  nameSortFn(a: any, b: any, sortOrder: string) {
    return a['name'].localeCompare(b['name']);
  }

  /* value参数排序 */
  valueSortFn(a: any, b: any, sortOrder: string) {
    return a['paramValue'] - b['paramValue'];
  }

  /* type参数排序 */
  typeSortFn(a: any, b: any, sortOrder: string) {
    return a['typeName'].localeCompare(b['typeName']);
  }

  /*返回 使用浏览器后退功能*/
  goback(){
    history.back();
  }
}
