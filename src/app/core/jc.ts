///<reference path="../../../node_modules/rxjs/internal/Observable.d.ts"/>
/**
 * Created by Myself
 */

import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Title} from "@angular/platform-browser";

import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Observer, Observable} from 'rxjs';
import {environment} from '../../environments/environment';

/*
    把公用的提示信息放到Service里面,用起来很舒服,
    但是Service参与了UI的控制,就没法做到独立通用.
* */


/*服务器请求返回对象Code
 @param code 1000 成功 2000 登录超时 3000 程序异常 4000 系统异常
 @param result 返回结果对象
 @param message 消息
 * */
export class RCode {
  static success: number = 1000;
  static reLogin: number = 2000;
  static error: number = 3000;
  static systemError: number = 4000;
}

export interface IPage {
  pageIndex: number;   //页序号
  pageSize: number;   //页大小
  sort: string;   //排序字段名称
  order: string;   //排序方向 asc desc
}

export interface ISelected {
  isSelected: boolean;//是否选中
}

/*服务器请求返回对象
 @param code 1000 成功 2000 登录超时 3000 程序异常 4000 系统异常
 @param result 返回结果对象
 @param message 消息
 * */
export class Robj<T> {
  code: number;
  result: T;
  message = '';
}

/*Key Value对象*/
export class KeyValueObj {
  Key: any;
  Value: any;

  constructor (key: any, value: any) {
    this.Key = key;
    this.Value = value;
  }
}

/*Page对象
 Created by Myself
 @param total 总记录数
 @param rows T数组
 * */
export class Page<T> {
  total: number;
  rows: T[];
}

// SelectItem 下拉选择Item对象
export class SelectItem {
  text: string;   // Item显示文本
  value: string;   // Item值
  constructor (text: string, value: string = '') {
    this.text = text;
    this.value = value;
  }
}

//
/*SnHelper类
 Helper:内容
 ajax
 * */
export class Jc {

  /*--------Http ajax----------------------------------------------------------------------------*/
  private static heplerIsInit = false; // SnHelper是否已初始化
  static router: Router;
  static modal: NzModalService;
  static msg: NzMessageService;
  static msgDuration = 3; // 提示消息显示时间
  static ntf: NzNotificationService;
  static ntfDuration = 5; // 通知消息显示时间
  static http: HttpClient; // @param {Http} http - The injected Http.
  static titleService: Title;
  static currentUser: {};
  static token = '';

  /*初始化方法
   @param {Http} http
   @param {router} http
   @param {loginService} http
   * */
  static onInit (http: HttpClient, router: Router, modal: NzModalService, msg: NzMessageService, ntf: NzNotificationService, titleService: Title) {
    Jc.http = http;
    Jc.router = router;
    Jc.modal = modal;
    Jc.msg = msg;
    Jc.ntf = ntf;
    Jc.titleService = titleService;
    Jc.heplerIsInit = true;
    Jc.token = localStorage.getItem('JcCoreToken');
  }

  /*跳转
  * */
  static goTo (url: string, params: {} = {}) {
    Jc.router.navigateByUrl(url, params);
  }

  /*设置页面标题
  * */
  static setTitle (title: string) {
    Jc.titleService.setTitle(title);
  }

  /*获取完整请求Url*/
  static getRequestUrl (url) {
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    } else {
      url = `./` + url;
    }
    if (url.indexOf('?', 0) === -1) {
      url += '?rnd=' + Math.random();
    } else {
      url += '&rnd=' + Math.random();
    }
    return url;
  }

  /*异步Post请求
    url:string Post请求地址
    params:any 请求参数
    autoError:boolean 自动处理错误消息(true)
    autoRedirectLogin:boolean 自动跳转登录页面(true)
    waitingTipMsg:string 请求等待提示消息
    waitingTipTitle:string 请求等待提示标题
  * */
  static ajax (url: string, params: any = {}, autoError: boolean = true, autoRedirectLogin: boolean = true, waitingTipMsg = '', waitingTipTitle = ''): Observable<any> {
    if (!Jc.heplerIsInit) {
      Jc.modal.info({
        nzTitle: '提示', nzContent: 'SnHelper未初始化.无法使用ajax服务.'
      });
      return;
    }
    let ajaxObserver: Observer<any>;
    const ajaxObservable = new Observable<any>(observer => ajaxObserver = observer);
    /*if (waitingTipMsg !== '') {
      Jc.showWaitingBox(waitingTipMsg, waitingTipTitle);
    }*/
    const headers = new HttpHeaders()
      .set('token', Jc.token ? Jc.token : '')
      .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
    url = Jc.getRequestUrl(url);
    const paramsStr = Jc.transformRequest(params);
    Jc.http.post(url, paramsStr, {headers: headers})
      .subscribe((robj) => {
        Jc.observerNext(ajaxObserver, robj);
      }, err => {// 网络等异常 提示网络异常后,抛出完成
        if (autoError) {
          Jc.showErrorMessageBox('网络异常,请稍候重试...');
        }
        Jc.observerError(ajaxObserver, '网络异常,请稍候重试...');
      }, () => {// 请求完成
        Jc.observerComplete(ajaxObserver);
      });
    return ajaxObservable;
  }


  /*异步Post请求
    url:string Post请求地址
    params:any 请求参数
    autoError:boolean 自动处理错误消息(true)
    autoRedirectLogin:boolean 自动跳转登录页面(true)
    waitingTipMsg:string 请求等待提示消息
    waitingTipTitle:string 请求等待提示标题
  * */
  static download (url: string, params: any = {}, fileName: string = 'fileName', autoError: boolean = true, waitingTipMsg = '', waitingTipTitle = ''): Observable<any> {
    if (!Jc.heplerIsInit) {
      Jc.modal.info({
        nzTitle: '提示', nzContent: 'SnHelper未初始化.无法使用ajax服务.'
      });
      return;
    }
    let ajaxObserver: Observer<any>;
    const ajaxObservable = new Observable<any>(observer => ajaxObserver = observer);
    if (waitingTipMsg !== '') {
      Jc.showWaitingBox(waitingTipMsg, waitingTipTitle);
    }
    const headers = new HttpHeaders()
      .set('token', Jc.token ? Jc.token : '')
      .set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8;');
    url = Jc.getRequestUrl(url);
    const paramsStr = Jc.transformRequest(params);
    Jc.http.post(url, paramsStr, {headers: headers, responseType: 'blob'})
      .subscribe((blob: Blob) => {
        let objectUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display:none');
        a.setAttribute('href', objectUrl);
        a.setAttribute('download', fileName);
        a.click();
        document.body.removeChild(a);
        //释放URL地址
        URL.revokeObjectURL(objectUrl);
      }, err => {// 网络等异常 提示网络异常后,抛出完成
        if (autoError) {
          Jc.showErrorMessageBox('网络异常,请稍候重试...');
        }
        Jc.observerError(ajaxObserver, '网络异常,请稍候重试...');
        if (waitingTipMsg !== '') {
          // 等待提示对话框 关闭
        }
      }, () => {// 请求完成
        Jc.observerComplete(ajaxObserver);
        if (waitingTipMsg !== '') {
          // 等待提示对话框 关闭
        }
      });
    return ajaxObservable;
  }


  /*异步Post请求
  FormData 上传文件
  * */
  static formajax (url: string, params: any = {}, autoError: boolean = true, waitingTipMsg = '', waitingTipTitle = ''): Observable<any> {
    if (!Jc.heplerIsInit) {
      Jc.modal.info({
        nzTitle: '提示', nzContent: 'SnHelper未初始化.无法使用ajax服务.'
      });
      return;
    }
    if (waitingTipMsg !== '') {
      Jc.showWaitingBox(waitingTipMsg, waitingTipTitle);
    }
    let ajaxObserver: Observer<any>;
    const ajaxObservable = new Observable<any>(observer => ajaxObserver = observer);
    const headers = new HttpHeaders().set('token', Jc.token ? Jc.token : '');
    url = Jc.getRequestUrl(url);
    try {
      Jc.http.post<Object>(url, params, {headers: headers}).subscribe((robj: Robj<Object>) => {
        if (robj.code === 2000) { // 登录超时
          Jc.router.navigateByUrl('passport/login');
          Jc.observerError(ajaxObserver, robj.message);
        } else if (robj.code === 1000) {
          Jc.observerNext(ajaxObserver, robj.result);
        } else {
          if (autoError) {
            Jc.showErrorMessageBox(robj.message);
          }
          Jc.observerError(ajaxObserver, robj.message);
        }
      }, err => {// 网络等异常 提示网络异常后,抛出完成
        if (autoError) {
          Jc.showErrorMessageBox('网络异常,请稍候重试...');
        }
        Jc.observerError(ajaxObserver, '网络异常,请稍候重试...');
        if (waitingTipMsg !== '') {
          // 等待提示对话框 关闭
        }
      }, () => {// 请求完成
        Jc.observerComplete(ajaxObserver);
        if (waitingTipMsg !== '') {
          // 等待提示对话框 关闭
        }
      });
    } catch (e) {
      console.log(e);
    }
    return ajaxObservable;
  }

  /*将Object属性转换为字符串*/
  static transformRequest (obj): string {
    const str = [];
    for (const p in obj) {
      const pval = obj[p];
      if (typeof (pval) == 'function') {
        continue;
      } else if (typeof (pval) == 'object') {
        str.push(p + '=' + encodeURIComponent(JSON.stringify(pval)));
      } else {
        str.push(p + '=' + encodeURIComponent(pval));
      }
    }
    return str.join('&');
  }

  /*------------------Observer-----------------------------------------------------*/

  /*Obserable订阅推送*/
  static observerNext (ob: Observer<any>, val: any) {
    if (ob) {
      try {
        ob.next(val);
      } catch (ex) {
      }
    }
  }

  static observerError (ob: Observer<any>, val: any) {
    if (ob) {
      try {
        ob.error(val);
      } catch (ex) {
      }
    }
  }

  static observerComplete (ob: Observer<any>) {
    if (ob) {
      try {
        ob.complete();
      } catch (ex) {
      }
    }
  }

  /*--------------------其它辅助方法------------------------*/
  /*------------------弹窗,提示框处理-----------------------------------------------------*/

  /*参数:
   msg: 消息文本
   okfun:点击确定按钮回调方法
   cancelfun:点击取消回调方法
   okVal:确定按钮文本
   cancel:取消按钮文本
   使用:showConfirmMsgBox("您输入的信息有误!", fun,fun,"提示","确定");
   */
  static showOkMessageBox (msg: string = '', title: string = '提示', okVal: string = '确定'){
    if (msg) {
      Jc.msg.info(msg);
    }
  }


  /*------------------弹窗,提示框处理-----------------------------------------------------*/

  /*参数:
   msg: 消息文本
   okfun:点击确定按钮回调方法
   cancelfun:点击取消回调方法
   okVal:确定按钮文本
   cancel:取消按钮文本
   使用:showConfirmMsgBox("您输入的信息有误!", fun,fun,"提示","确定");
   */
  static showErrorMessageBox (msg: string = '', title: string = '提示', okVal: string = '确定', cancelVal: string = '取消'): void {
    if (msg) {
      Jc.msg.info(msg);
    }
  }


  /*参数:
   msg: 消息文本
   okfun:点击确定按钮回调方法
   cancelfun:点击取消回调方法
   title:窗口标题
   okVal:确定按钮文本
   cancel:取消按钮文本
   使用:showConfirmMsgBox("您输入的信息有误!", fun,fun,"提示","确定","取消");
   */
  static showConfirmBox (msg: string = '', okSub: boolean = true, cancelSub: boolean = false, title: string = '提示', okVal: string = '确定', cancelVal: string = '取消'){
    if (msg) {
      Jc.msg.info(msg);
    }
  }

  /*显示信息
   参数:
   content: dialog内容
   title:窗口标题
   */
  static showModalBox (content: string = '', title: string = '', dlgwidth: number = 0): void {
    if (content) {
      Jc.msg.info(content);
    }
  }

  /*显示提示消息,用户无法关闭
   参数:
   msg: 消息文本
   title:窗口标题
   time:定时关闭 毫秒
   */
  static showInfoBox (msg: string = '', title: string = '', time: number = 0): void {
    if (msg) {
      Jc.msg.info(msg);
    }
  }

  /*等待窗口,用户无法关闭
   参数:
   msg: 消息文本
   title:窗口标题
   time:定时关闭
   */
  static showWaitingBox (msg: string = '', title: string = '', time: number = 0): void {
    if (msg) {
      Jc.msg.info(msg);
    }
  }

  /*日期处理相关*/
  /*休息ms*/
  static sleep = async (duration) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, duration);
    });
  };

  // 日期格式化
  static formatDate (date, fmt = 'yyyy-MM-dd'): string {
    if (!date) {
      return;
    }
    try {
      if (typeof(date) == 'string') { // 处理传入格式为字符串
        date = new Date(date);
      }
      const o = {
        'M+': date.getMonth() + 1,                 // 月份
        'd+': date.getDate(),                    // 日
        'h+': date.getHours(),                   // 小时
        'm+': date.getMinutes(),                 // 分
        's+': date.getSeconds(),                 // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds()             // 毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
      }
    } catch (err) {
      fmt = '';
    }
    return fmt;
  }

  // 日期 有效性校验
  static validDateStr (dateStr: string): boolean {
    const isNum = this.regexValidate('^[0-9]*$', dateStr); // 校验是否为数字
    let isValid = false;
    if (isNum && (dateStr.length === 4 || dateStr.length === 6 || dateStr.length === 8)) {
      let intYear;
      let intMonth;
      let intDay;
      if (dateStr.length === 4) {
        intYear = parseInt(dateStr, 10);
      } else if (dateStr.length === 6) {
        intYear = parseInt(dateStr.substring(0, 4), 10);
        intMonth = parseInt(dateStr.substring(4, 6), 10);
      } else {
        intYear = parseInt(dateStr.substring(0, 4), 10);
        intMonth = parseInt(dateStr.substring(4, 6), 10);
        intDay = parseInt(dateStr.substring(6, 8), 10);
      }
      isValid = this.isdate(intYear, intMonth, intDay);
    }
    return isValid;
  }

  // 正则校验
  static regexValidate (regex: any, validateString: string): boolean {
    const re = new RegExp(regex);
    return re.test(validateString);
  }

  // 校验日期是否合法
  static isdate (intYear: number, intMonth: number, intDay: number): boolean {
    if (intMonth > 12 || intMonth < 1) {
      return false;
    }
    if (intDay < 1 || intDay > 31) {
      return false;
    }
    if ((intMonth === 4 || intMonth === 6 || intMonth === 9 || intMonth === 11) && (intDay > 30)) {
      return false;
    }
    if (intMonth === 2) {
      if (intDay > 29) {
        return false;
      }
      if ((((intYear % 100 === 0) && (intYear % 400 !== 0)) || (intYear % 4 !== 0)) && (intDay > 28)) {
        return false;
      }
    }
    return true;
  }

  // 填充开始日期
  static setStartDate (startDateStr: string, queryObj: any, feild: string): void {
    if (startDateStr.length === 4) {
      queryObj[feild] = queryObj[feild] + '-' + '01-01';
    } else if (startDateStr.length === 6) {
      queryObj[feild] = queryObj[feild].substring(0, 4) + '-' + queryObj[feild].substring(4, 6) + '-01';
    } else {
      queryObj[feild] = queryObj[feild].substring(0, 4) + '-' + queryObj[feild].substring(4, 6) + '-' + queryObj[feild].substring(6, 8);
    }
  }

  // 填充结束日期
  static setEndDate (endDateStr: any, queryObj: any, feild: string): void {
    if (endDateStr.length === 4) {
      queryObj[feild] = endDateStr + '-12-31';
    } else if (endDateStr.length === 6) {
      let day = '31';
      const intMonth = parseInt(endDateStr.substring(4, 6), 10);
      const year = parseInt(endDateStr.substring(0, 4), 10);
      // let day= new Date(endDateStr.substring(0,4),endDateStr.substring(4,2),0);
      if (intMonth === 4 || intMonth === 6 || intMonth === 9 || intMonth === 11) {
        day = '30';
      }
      if (intMonth === 2) {
        if (this.leapyear(year)) {
          day = '29';
        } else {
          day = '28';
        }
      }
      queryObj[feild] = endDateStr.substring(0, 4) + '-' + endDateStr.substring(4, 6) + '-' + day + ' 23:59:59';
    } else {
      queryObj[feild] = endDateStr.substring(0, 4) + '-' + endDateStr.substring(4, 6) + '-' + endDateStr.substring(6, 8) + ' 23:59:59';
    }

  }

  // 判断闰年
  static leapyear (year): boolean {
    if (((year % 400 === 0) || (year % 100 !== 0)) && (year % 4 === 0)) {
      return true;
    } else {
      return false;
    }
  }

  /*只有两个都存在时进行比较*/
  static compareObjDate (startDateStr: string, endDateStr: string, queryObj: any): boolean {
    if (!queryObj[startDateStr] || !queryObj[endDateStr]) {
      return true;
    }
    const startStr = queryObj[startDateStr].replace(/-/g, '/');
    const endStr = queryObj[endDateStr].replace(/-/g, '/');
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    if (endDate < startDate) {
      queryObj[startDateStr] = '';
      queryObj[endDateStr] = '';
      return false;
      // throw new Error('结束日期不能小于开始日期.');
    }
    return true;
  }

  /*只有两个都存在时进行比较*/
  static compareDate (startDate: any, endDate: any): number {
    let result = 0;
    if (typeof (startDate) == 'string') {
      startDate = new Date(startDate.replace(/-/g, '/'));
    }
    if (typeof (endDate) == 'string') {
      endDate = new Date(endDate.replace(/-/g, '/'));
    }
    if (endDate < startDate) {
      result = -1;
    } else if (endDate == startDate) {
      result = 0;
    } else if (endDate > startDate) {
      result = 1;
    }
    return result;
  }


  /*获取日期 日期加减*/
  static addDate (date: any, year: number = 0, month: number = 0, days: number = 0, hours: number = 0, minutes: number = 0, seconds: number = 0, msec: number = 0): Date {
    if (typeof (date) == "string") {
      date = new Date(date.replace(/-/g, "/"));
    }
    const dt = date;
    dt.setFullYear(dt.getFullYear() + year);
    dt.setMonth(dt.getMonth() + month);
    dt.setDate(dt.getDate() + days);
    if (hours != 0 || minutes != 0 || seconds != 0 || msec != 0) {
      dt.setTime(dt.setMilliseconds(dt.getMilliseconds() + msec)); //毫秒
      dt.setTime(dt.setSeconds(dt.getSeconds() + seconds)); //秒
      dt.setTime(dt.setMinutes(dt.getMinutes() + minutes)); //分
      dt.setTime(dt.setHours(dt.getHours() + hours)); //小时
    }
    return dt;
  }

  /*获取文件上传Speed*/
  static getFileUploadSpeed (fileSize: number, dtStart: number, dtEnd: number): string {
    const totalSeconds = (dtEnd - dtStart) / 1000;
    let sizePreSecond = fileSize / totalSeconds;
    let speed;
    sizePreSecond = sizePreSecond > fileSize ? fileSize : sizePreSecond;
    // 如果大小大于0.8M使用'M'为单位表示, 1位小数点
    if (sizePreSecond > 1024 * 800) {
      speed = Math.round(sizePreSecond / (1024 * 1024) * 10) / 10 + 'M/S';
    } else if (sizePreSecond > 1024) {
      // 如果大小大于1KB使用'KB'为单位表示, 1位小数点
      speed = Math.round(sizePreSecond / 1024 * 10) / 10 + 'KB/S';
    } else {
      // 如果大小大于1KB使用'KB'为单位表示, 1位小数点
      speed = sizePreSecond + 'B/S';
    }
    return speed;
  }

  /*获取文件大小描述*/
  static getFileSizeStr (fileSize: number): string {
    let fileSizeStr = '';
    if (fileSize > 1024 * 1024) {
      fileSizeStr = Math.round(fileSize / (1024 * 1024) * 10) / 10 + 'MB';
    } else if (fileSize > 1024) {
      // 如果大小大于1KB使用'KB'为单位表示, 1位小数点
      fileSizeStr = Math.round(fileSize / 1024 * 10) / 10 + 'KB';
    }
    return fileSizeStr;
  }

  /*toLocalString() IE11中的toLocalString会出错*/
  arrayToString (tArray: Array<any>, splitChar: string): string {
    let str = '';
    splitChar = splitChar ? splitChar : ',';
    if (tArray) {
      for (let i = 0; i < tArray.length; i++) {
        if (str === '') {
          str += tArray[i].toString();
        } else {
          str += splitChar + tArray[i].toString();
        }
      }
    }
    return str;
  }


  /*生成Guid*/
  static newGuid (): string {
    let guid = "";
    for (let i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) guid += "-";
    }
    return guid;
  }

  /*首字母小写*/
  static firstToLower(str:string):string{
    let result = str;
    if(result){
      result = result[0].toLowerCase() + result.substring(1);
    }
    return result;
  }
  /*首字母大写*/
  static firstToUpper(str:string):string{
    let result = str;
    if(result){
      result = result[0].toUpperCase() + result.substring(1);
    }
    return result;
  }
}

