import {Component, OnInit} from '@angular/core';
import {Area, Controller} from "@pages/workbench/service/api";
import {ApiService} from "@pages/workbench/service/api.service";

@Component({
  selector: 'app-workbench', templateUrl: './workbench.component.html', styleUrls: ['./workbench.component.less']
})
export class WorkbenchComponent implements OnInit {
  //for修复 nz-affix控件 reusetab情况下,返回后宽度为0bug
  showControllerList: boolean = true;  //显示ControllerList

  isDisplayAllMenuSelected: boolean = true;
  tagcolor: string[] = ['cyan', 'geekblue', 'blue', 'purple'];
  actionTableSize: string = 'large';
  searchText: string = ''; //Controller 过滤条件
  controllerList: Controller[] = [];    //实际显示ControllerList
  selectedController: Controller[] = [];

  areaList: Area[] = [];
  selectedArea: Area[] = [];
  showAreaFilter: boolean = false;
  isAllAreaSelected: boolean = false;
  isAreaSelectIndeterminate: boolean = false;

  constructor (private apiSvc: ApiService) {
    let actionTableSize = localStorage.getItem('actionTableSize');
    this.actionTableSize = actionTableSize ? actionTableSize : 'large';
  }

  ngOnInit () {
    this.initControllerList();
  }

  //用于修复 onReuseInit执行两次bug
  //路由复用 retrieve方法会执行两次,暂时无法解决.
  onReuseFlag:boolean = false;
  _onReuseInit () {
    if(this.onReuseFlag) {
      //修复 nz-affix控件 reusetab情况下,返回后宽度为0 bug
      this.showControllerList = false;
      setTimeout(() => {
        this.showControllerList = true;
        //console.log('_onReuseInit setTimeout Run');
      }, 1);
      //console.log('_onReuseInit');
      this.onReuseFlag = false;
    }else{
      this.onReuseFlag = true;
    }
  }

  _onReuseDestroy () {
    //console.log('_onReuseDestroy');
  }

  /*初始化ControllerList*/
  initControllerList () {
    this.searchText = "";
    this.isDisplayAllMenuSelected = false;
    this.controllerList = [];
    this.apiSvc.getControllerList().subscribe((controllerList: Controller[]) => {
      this.controllerList = controllerList;
      this.initAreaList();
      this.displayAll();
    });
  }

  /*初始化AreaList*/
  initAreaList () {
    this.areaList = [];
    this.selectedArea = [];
    if (this.controllerList) {
      this.controllerList.forEach(controller => {
        if (this.areaList.filter(area => area.areaName == controller.areaName).length <= 0) {
          let area: Area = {
            areaName: controller.areaName,
            displayName: controller.areaName ? controller.areaName : 'None',
            isSelected: false
          };
          this.areaList.push(area);
        }
      });
      this.areaList.sort((a1, a2) => {
        let result: number = 0;
        if (a1.areaName != a2.areaName) {
          result = a1.areaName >= a2.areaName ? 1 : -1;
        }
        return result;
      });
    }
  }

  /*全选*/
  allSelectAreaChange () {
    this.areaList.forEach(area => {
      area.isSelected = this.isAllAreaSelected;
    });
    this.selectedArea = this.areaList.filter(area => area.isSelected);
  }

  /*selecteArea*/
  areaSelectChange (area: Area): void {
    if (this.areaList.filter(a => !a.isSelected).length <= 0) {
      this.isAllAreaSelected = true;
      this.isAreaSelectIndeterminate = false;
    } else if (this.areaList.filter(a => a.isSelected).length <= 0) {
      this.isAllAreaSelected = false;
      this.isAreaSelectIndeterminate = false;
    } else {
      this.isAreaSelectIndeterminate = true;
    }
    this.selectedArea = this.areaList.filter(area => area.isSelected);
  }

  /*刷新Controller列表*/
  refreshControllerList () {
    this.initControllerList();
  }

  /*选中Controller*/
  onSelectController (controller: Controller) {
    this.selectedController = [];
    this.selectedController.push(controller);
    console.log(controller);
    this.controllerList.forEach(a => {
      if (a != controller) {
        a.isSelected = false;
      } else {
        a.isSelected = true;
      }
    });
    this.isDisplayAllMenuSelected = false;
  }

  /*显示所有Controller*/
  displayAll () {
    this.selectedController = this.controllerList;
    this.isDisplayAllMenuSelected = true;
    this.controllerList.forEach(controller => {
      controller.isSelected = false;
    });
  }

  /*actionTableSize改变*/
  actionTableSizeChanged () {
    localStorage.setItem('actionTableSize', this.actionTableSize);
  }
}
