import {Component, OnInit} from '@angular/core';
import {ApiService} from '@pages/workbench/service/api.service';
import {ActivatedRoute} from '@angular/router';
import {TsModel, TsPi, TsResult} from '@pages/workbench/service/tsmodel';
import {Util} from "@core/util";

@Component({
  selector: 'app-tsviewer', templateUrl: './tsviewer.component.html', styleUrls: ['./tsviewer.component.less']
})
export class TsViewerComponent implements OnInit {
  itemId: string;
  itemType: string;
  tsServiceType = '1';
  tsModelViewType = '1';
  isShowPageQueryModel = true;
  tsResult: TsResult;

  tsModelCode: string;
  tsModelCodeWithPgQuery: string;

  showCode: boolean = false;
  codeTitle: string;
  tsCode: string;

  isCtrlDown: boolean = false;
  isShiftDown: boolean = false;

  constructor (private routerParams: ActivatedRoute, private apiSvc: ApiService) {
    const tsServiceType = localStorage.getItem('tsServiceType');
    this.tsServiceType = tsServiceType ? tsServiceType : '1';

    const tsModelViewType = localStorage.getItem('tsModelViewType');
    this.tsModelViewType = tsModelViewType ? tsModelViewType : '1';

    const isShowPageQueryModel = localStorage.getItem('isShowPageQueryModel');
    if (isShowPageQueryModel === 'false') {
      this.isShowPageQueryModel = false;
    }
  }

  ngOnInit () {
    this.itemId = this.routerParams.snapshot.paramMap.get('itemId');
    this.itemType = this.routerParams.snapshot.paramMap.get('itemType');
    if (this.itemId && this.itemType) {
      this.getTsModel();
    }
  }

  /*获取TsModel*/
  getTsModel () {
    this.apiSvc.getTs(this.itemId, this.itemType).subscribe((tsResult: TsResult) => {
      this.tsResult = tsResult;
      if (tsResult && tsResult.tsModelList) {
        let tsModelCode = '';
        let tsModelCodeWithPgQuery = '';
        tsResult.tsModelList.forEach(tsModel => {
          tsModelCode += tsModel.tsModelCode;
          tsModelCodeWithPgQuery += tsModel.tsModelCode;
          tsModelCodeWithPgQuery += tsModel.pgQueryModelCode;
        });
        this.tsModelCode = tsModelCode;
        this.tsModelCodeWithPgQuery = tsModelCodeWithPgQuery;
      }
    });
  }

  /*选择Model 属性*/
  selectPi (tsModel: TsModel, pi: TsPi, index: number) {
    this.tsResult.tsModelList.forEach(a => {
      if (a !== tsModel) {
        a.piList.forEach(p => {
          p.isSelected = false;
        });
      }
    });

    if (!this.isCtrlDown && !this.isShiftDown) {//如果非多选,取消其它选中
      tsModel.piList.filter(a => a.isSelected === true).forEach((a, index) => {
        if (a != pi) {
          a.isSelected = false;
        }
      });
      pi.isSelected = !pi.isSelected;
    } else if (this.isCtrlDown) {
      pi.isSelected = !pi.isSelected;
    } else if (this.isShiftDown) {
      let minIndex: number = -1;
      let maxIndex: number = -1;
      tsModel.piList.filter(a => a.isSelected === true)
        .forEach((a) => {
          let index = tsModel.piList.indexOf(a);
          if (minIndex === -1 || minIndex > index) {
            minIndex = index;
          }
          if (maxIndex === -1 || maxIndex < index) {
            maxIndex = index;
          }
        });
      if (minIndex === -1) {  //之前没有选中的
        pi.isSelected = !pi.isSelected;
        return;
      }
      if (index === minIndex || index === maxIndex) {//选中当前第一条或最后一条
        pi.isSelected = !pi.isSelected;
        return;
      }

      //Shift按下 选中原则 从低到高
      if (index < minIndex) {  //选中下面的行
        for (let i = index; i <= maxIndex; i++) {
          tsModel.piList[i].isSelected = true;
        }
      } else if (index > maxIndex) { //选中上面的行
        for (let i = minIndex; i <= index; i++) {
          tsModel.piList[i].isSelected = true;
        }
      } else {  //选中中间行
        for (let i = minIndex; i <= index; i++) {
          tsModel.piList[i].isSelected = true;
        }
        for (let i = index + 1; i <= maxIndex; i++) {
          tsModel.piList[i].isSelected = false;
        }
      }
    }
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

  /*查看ModelCode*/
  viewModelCode (tsModel: TsModel) {
    this.tsCode = tsModel.tsModelCode + tsModel.pgQueryModelCode;
    this.codeTitle = tsModel.name + ' Code';
    this.showCode = true;
  }

  /*查看Lambda Code*/
  viewLambda (tsModel: TsModel) {
    if (tsModel.piList.filter(a => a.isSelected).length <= 0) {
      Util.showInfoBox('No record is selected.');
      return;
    }
    let selectedPiList = tsModel.piList.filter(a => a.isSelected);
    let lambdaStr = "";

    // SetValue Lambda
    let setValueLambda = "//1 SetValue \r\n";
    setValueLambda += tsModel.name + ' ' + Util.firstToLower(tsModel.name)
                        + ' = new ' + tsModel.name + '();\r\n';
    selectedPiList.forEach((a, index) => {
      setValueLambda += Util.firstToLower(tsModel.name) + '.' + Util.firstToLower(a.name)
                          + ' = source.' + Util.firstToLower(a.name) + ';\r\n';
    });

    // Expression Lambda
    let expLambda = "//2 Expression Lambda \r\n";
    if (selectedPiList.length == 1) {  //length == 1
      expLambda += 'a => a.' + selectedPiList[0].name + '\r\n';
    } else { //length > 1
      expLambda += 'var exp = ExpressionHelper.CreateExpression<' + tsModel.name + '>(a => new {\r\n';
      selectedPiList.forEach((a, index) => {
        expLambda += '  ' + 'a.' + a.name;
        if (index < selectedPiList.length - 1) {
          expLambda += ',';
        }
        expLambda += '\r\n';
      });
      expLambda += '};\r\n';
    }

    // Ctor Lambda
    let ctorLambda = "//3 C# Ctor \r\n";
    ctorLambda += tsModel.name + ' ' + Util.firstToLower(tsModel.name)
                        + ' = new ' + tsModel.name + '(){\r\n';
    selectedPiList.forEach((a, index) => {
      ctorLambda += '  ' + a.name + ' = source.' + a.name;
      if (index < selectedPiList.length - 1) {
        ctorLambda += ',';
      }
      ctorLambda += '\r\n';
    });
    ctorLambda += '};\r\n';

    this.tsCode = setValueLambda + '\r\n' + expLambda + '\r\n' + ctorLambda;
    this.codeTitle = tsModel.name + ' Lambda';
    this.showCode = true;
  }

  /*隐藏Modal*/
  closeModal () {
    this.showCode = false;
  }

  /*ModelView类型变化*/
  modelViewTypeChanged () {
    localStorage.setItem('tsModelViewType', this.tsModelViewType);
  }

  /*isShowPageQueryModel变化*/
  isShowPageQueryModelChanged () {
    localStorage.setItem('isShowPageQueryModel', this.isShowPageQueryModel.toString());
  }

  /*使用服务类型变化*/
  tsServiceTypeChanged () {
    localStorage.setItem('tsServiceType', this.tsServiceType);
  }

  /*keyDownHandler*/
  onKeyDownHandler (event:any): void {
    switch (event.keyCode) {
      case 16:  //Shift  暂时不支持Shift
        this.isShiftDown = true;
        event.preventDefault();
        break;
      case 17:  //Ctrl
        this.isCtrlDown = true;
        event.preventDefault();
        break;
      case 37:  //← 左
        break;
      case 38:  //↑ 上
        if (this.isCtrlDown || this.isShiftDown) {
        } else {
        }
        event.preventDefault();
        break;
      case 39:  //→ 右
        break;
      case 40:  //↓ 下
        if (this.isCtrlDown || this.isShiftDown) {
        } else {
        }
        event.preventDefault();
        break;
      default:
        break;
    }

    //console.log('onKeyDown this.isShiftDown:',this.isShiftDown);
    //console.log('onKeyDown this.isCtrlDown:',this.isCtrlDown);
  }

  /*keyUpHandler*/
  onKeyUpHandler (event:any): void {
    switch (event.keyCode) {
      case 16:  //Shift
        this.isShiftDown = false;
        event.preventDefault();
        break;
      case 17:  //Ctrl
        this.isCtrlDown = false;
        event.preventDefault();
        break;
      default:
        break;
    }
    //console.log('onKeyUp this.isShiftDown:',this.isShiftDown);
    //console.log('onKeyUp this.isCtrlDown:',this.isCtrlDown);
  }

  /*返回 使用浏览器后退功能*/
  goback () {
    history.back();
  }
}
