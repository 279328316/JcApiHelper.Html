import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Util} from '@core/util';
import {TsModel, TsPi} from '@pages/workbench/service/tsmodel';

@Component({
  selector: 'app-jsontool', templateUrl: './jsontool.component.html', styleUrls: ['./jsontool.component.less']
})
export class JsonToolComponent implements OnInit, AfterViewInit {
  jsonStr = '';
  formatResult = '';
  lines = '';
  defaultLines = 50;
  line: HTMLElement;

  tsModelList: TsModel[] = [];
  tsCode = '';
  showCode = false;

  constructor() {
  }

  ngOnInit() {
    for (let i = 1; i <= 50; i++) {
      this.lines += i.toString() + '\r\n';
    }
  }

  ngAfterViewInit() {
    this.line = document.getElementById('line');
  }

  /*text Area 滚动*/
  scroll(e:any) {
    this.line.scrollTop = e.target.scrollTop;
  }

  /*格式化字符串*/
  formatJson() {
    if (!this.jsonStr) {
      this.formatResult = '';
      return;
    }
    try {
      const obj = JSON.parse(this.jsonStr);
      this.jsonStr = JSON.stringify(obj, null, 4);
      this.formatResult = 'Valid';
    } catch (error) {
      this.formatResult = 'Invalid';
    }
    this.textChange();
  }

  /*格式化字符串*/
  viewStr() {
    if (!this.jsonStr) {
      this.formatResult = '';
      return;
    }
    try {
      const obj = JSON.parse(this.jsonStr);
      this.jsonStr = JSON.stringify(obj);
      this.formatResult = 'Valid';
    } catch (error) {
      this.formatResult = 'Invalid';
    }
    this.textChange();
  }

  /*复制成功*/
  copySuccess() {
    Util.showInfoBox('内容已复制');
  }

  /*查看样例*/
  viewSample() {
    const obj = {
      name: '张小东',
      age: 19, sex: '男',
      birthday: new Date(),
      isChildren: true,
      alias: ['东子'],
      friends: [{name: '张三', age: 17, sex: '男'},
        {name: '李四', age: 18, sex: '男'}]
    };
    this.jsonStr = JSON.stringify(obj);
    this.formatJson();
  }

  /*清空*/
  clear() {
    this.jsonStr = '';
  }

  /*查看TsModel*/
  viewTs() {
    this.formatJson();
    if (this.formatResult === 'Valid') {
      const obj = JSON.parse(this.jsonStr);
      this.tsModelList = [];
      this.tsCode = '';
      this.getTsClass(obj);

      if (this.tsModelList.length > 0) {
        this.tsModelList.forEach((tsModel, index) => {
          const className = tsModel.name ? tsModel.name : 'tsModel' + index.toString();
          let codeStr = '/*' + className + '*/\n';
          codeStr += 'export class ' + className + ' {' + '\n';
          tsModel.piList.forEach(pi => {
            codeStr += '  ' + pi.name + ': ' + pi.tsType + ';\n';
          });
          codeStr += '}\n';
          this.tsCode += codeStr + '\n';
        });
        this.showCode = true;
      } else {
        Util.showInfoBox('No objects that can be generated.');
      }
    }
  }

  /*根据Object获取其Ts类型*/
  getTsClass(obj: any, pname: string = ''): string {
    const classStr = '';
    if (typeof (obj) === 'object') {
      if (obj instanceof Array) { // 数组类型
        if (obj.length > 0) {
          this.getTsClass(obj[0], pname);
        }
      } else {
        // 非数组类型 处理属性
        const tsModel = new TsModel();
        tsModel.name = pname;
        tsModel.piList = [];
        for (const p in obj) {
          const pval = obj[p];  // 获取属性值
          const pi = new TsPi();
          pi.name = p;
          if (typeof (pval) === 'object') {  // 对象属性
            if (pval instanceof Array) { // 数组对象
              if (pval.length > 0) {
                if (typeof(pval[0]) === 'object') {  // 对象数组
                  pi.tsType = Util.firstToUpper(p) + '[]';
                } else {  // 普通数组
                  pi.tsType = typeof(pval[0]) + '[]';
                }
              } else { // 空数组
                pi.tsType = 'any';
              }
            } else {   // 普通对象属性 以首字母大写属性名为类型
              pi.tsType = Util.firstToUpper(p);
            }
            this.getTsClass(pval, Util.firstToUpper(p));
          } else {  // 普通属性
            pi.tsType = typeof(pval);
          }
          tsModel.piList.push(pi);
        }
        this.tsModelList.push(tsModel);
      }
    }
    return classStr;
  }

  /*隐藏Modal*/
  closeModal() {
    this.showCode = false;
  }

  /*字符串改变*/
  textChange() {
    this.lines = '';
    let index = this.jsonStr.indexOf('\n');
    let lineCount = 1;
    if (index !== -1) {
      lineCount++;
      for (let i = 0; i < this.jsonStr.length; i++) {
        index = this.jsonStr.indexOf('\n', index + 1);
        if (index === -1) {
          break;
        }
        lineCount++;
      }
    }
    if (lineCount > this.defaultLines) {
      for (let i = 1; i <= lineCount; i++) {
        this.lines += i.toString() + '\r\n';
      }
    } else {
      for (let i = 1; i <= this.defaultLines; i++) {
        this.lines += i.toString() + '\r\n';
      }
    }
  }
}
