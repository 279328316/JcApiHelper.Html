import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Title } from "@angular/platform-browser";

import { NzModalService } from "ng-zorro-antd/modal";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Observer, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { ContentType, Robj } from "@models/robj";

/* Util Helper类
 Helper:内容
 ajax
 * */
export class Util {
  /*--------Http ajax----------------------------------------------------------------------------*/
  private static heplerIsInit = false; // SnHelper是否已初始化
  static router: Router;
  static modal: NzModalService;
  static msg: NzMessageService;
  static waitingBoxVisible: boolean = false;
  static msgDuration = 3; // 提示消息显示时间
  static ntf: NzNotificationService;
  static ntfDuration = 5; // 通知消息显示时间
  static http: HttpClient; // @param {Http} http - The injected Http.
  static titleService: Title;
  static token: string = "";

  /*初始化方法
     @param {Http} http
     @param {router} http
     @param {loginService} http
     * */
  static onInit(
    http: HttpClient,
    router: Router,
    modal: NzModalService,
    msg: NzMessageService,
    ntf: NzNotificationService,
    titleService: Title
  ) {
    Util.http = http;
    Util.router = router;
    Util.modal = modal;
    Util.msg = msg;
    Util.ntf = ntf;
    Util.titleService = titleService;
    Util.heplerIsInit = true;
  }

  /*跳转
   * */
  static goTo(url: string, params: {} = {}) {
    Util.router.navigateByUrl(url, params);
  }

  /*设置页面标题*/
  static setTitle(title: string) {
    Util.titleService.setTitle(title);
  }

  /*获取完整请求Url*/
  static getRequestUrl(url, random: boolean = true) {
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      url = environment.SERVER_URL + url;
    }
    if (random) {
      if (url.indexOf("?", 0) === -1) {
        url += "?rnd=" + Math.random();
      } else {
        url += "&rnd=" + Math.random();
      }
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
  static ajax(
    url: string,
    params: any = {},
    contentType: string = ContentType.form,
    autoError: boolean = true,
    autoRedirectLogin: boolean = true,
    waitingTipMsg = "",
    waitingTipTitle = ""
  ): Observable<any> {
    let ajaxObserver: Observer<any>;
    const ajaxObservable = new Observable<any>((observer) => (ajaxObserver = observer));
    if (!Util.heplerIsInit) {
      Util.modal.info({
        nzTitle: "提示",
        nzContent: "SnHelper未初始化.无法使用ajax服务.",
      });
      return ajaxObservable;
    }
    if (waitingTipMsg !== "") {
      Util.showWaitingBox(waitingTipMsg, waitingTipTitle);
    }
    let headers = new HttpHeaders().set("token", Util.token ? Util.token : "").set("Method", "Post");
    let ajaxParams = params;
    if (contentType == ContentType.json) {
      headers = headers.set("Content-Type", "application/json;charset=utf-8;");
    } else {
      headers = headers.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8;");
      ajaxParams = Util.transformRequest(params);
    }
    url = Util.getRequestUrl(url);
    Util.http.post(url, ajaxParams, { headers: headers }).subscribe({
      next: (robj: Robj<Object>) => {
        if (robj.code === 2000) {
          // 登录超时
          if (autoRedirectLogin) {
            Util.router.navigateByUrl("passport/login");
          }
          Util.observerError(ajaxObserver, robj.message);
        } else if (robj.code === 1000) {
          Util.observerNext(ajaxObserver, robj.result);
        } else {
          if (autoError) {
            Util.showErrorMessageBox(robj.message);
          }
          Util.observerError(ajaxObserver, robj.message);
        }
      },
      error: (err) => {
        // 网络等异常 提示网络异常后,抛出完成
        if (autoError) {
          Util.showErrorMessageBox("网络异常,请稍候重试...");
        }
        Util.observerError(ajaxObserver, "网络异常,请稍候重试...");
        if (waitingTipMsg !== "") {
          Util.closeWaitingBox(); // 等待提示对话框 关闭
        }
      },
      complete: () => {
        // 请求完成
        Util.observerComplete(ajaxObserver);
        if (waitingTipMsg !== "") {
          Util.closeWaitingBox(); // 等待提示对话框 关闭
        }
      },
    });
    return ajaxObservable;
  }

  /*异步get请求
      url:string Post请求地址
      params:any 请求参数
      autoError:boolean 自动处理错误消息(true)
      autoRedirectLogin:boolean 自动跳转登录页面(true)
      waitingTipMsg:string 请求等待提示消息
      waitingTipTitle:string 请求等待提示标题
    * */
  static get(
    url: string,
    params: any = {},
    autoError: boolean = true,
    autoRedirectLogin: boolean = true,
    waitingTipMsg = "",
    waitingTipTitle = ""
  ): Observable<any> {
    let ajaxObserver: Observer<any>;
    const ajaxObservable = new Observable<any>((observer) => (ajaxObserver = observer));
    if (!Util.heplerIsInit) {
      Util.modal.info({
        nzTitle: "提示",
        nzContent: "SnHelper未初始化.无法使用ajax服务.",
      });
      return ajaxObservable;
    }

    if (waitingTipMsg !== "") {
      Util.showWaitingBox(waitingTipMsg, waitingTipTitle);
    }
    const headers = new HttpHeaders()
      .set("token", Util.token ? Util.token : "")
      .set("Method", "Get")
      .set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8;");
    url = Util.getRequestUrl(url, false);
    const paramsStr = Util.transformRequest(params);
    if (url.indexOf("?", 0) === -1) {
      url += "?" + paramsStr;
    } else {
      url += "&" + paramsStr;
    }
    Util.http.get(url, { headers: headers }).subscribe({
      next: (robj: Robj<Object>) => {
        if (robj.code === 2000) {
          // 登录超时
          if (autoRedirectLogin) {
            Util.router.navigateByUrl("passport/login");
          }
          Util.observerError(ajaxObserver, robj.message);
        } else if (robj.code === 1000) {
          Util.observerNext(ajaxObserver, robj.result);
        } else {
          if (autoError) {
            Util.showErrorMessageBox(robj.message);
          }
          Util.observerError(ajaxObserver, robj.message);
        }
      },
      error: (err) => {
        // 网络等异常 提示网络异常后,抛出完成
        if (autoError) {
          Util.showErrorMessageBox("网络异常,请稍候重试...");
        }
        Util.observerError(ajaxObserver, "网络异常,请稍候重试...");
        if (waitingTipMsg !== "") {
          Util.closeWaitingBox(); // 等待提示对话框 关闭
        }
      },
      complete: () => {
        // 请求完成
        Util.observerComplete(ajaxObserver);
        if (waitingTipMsg !== "") {
          Util.closeWaitingBox(); // 等待提示对话框 关闭
        }
      },
    });
    return ajaxObservable;
  }

  /*异步Post 文件下载请求*/
  static ajaxDownload(
    url: string,
    params: any = {},
    fileName: string = "",
    fileType: string = null,
    contentType: string = ContentType.form,
    autoError: boolean = true,
    waitingTipMsg = "",
    waitingTipTitle = ""
  ): Observable<any> {
    let ajaxObserver: Observer<any>;
    const ajaxObservable = new Observable<any>((observer) => (ajaxObserver = observer));
    if (!Util.heplerIsInit) {
      Util.modal.info({
        nzTitle: "提示",
        nzContent: "SnHelper未初始化.无法使用ajax服务.",
      });
      return ajaxObservable;
    }
    if (waitingTipMsg !== "") {
      Util.showWaitingBox(waitingTipMsg, waitingTipTitle);
    }
    let headers = new HttpHeaders().set("token", Util.token ? Util.token : "").set("Method", "Post");

    let ajaxParams = params;
    if (contentType == ContentType.json) {
      headers = headers.set("Content-Type", "application/json;charset=utf-8;");
    } else {
      headers = headers.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8;");
      ajaxParams = Util.transformRequest(params);
    }
    url = Util.getRequestUrl(url);
    Util.http.post(url, ajaxParams, { headers: headers, observe: "response", responseType: "blob" }).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob: Blob | null = response.body;
        if (blob) {
          let objectUrl = URL.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display:none");
          a.setAttribute("href", objectUrl);
          a.setAttribute("download", fileName);
          a.click();
          document.body.removeChild(a);
          //释放URL地址
          URL.revokeObjectURL(objectUrl);
        }
      },
      error: (err) => {
        // 网络等异常 提示网络异常后,抛出完成
        if (autoError) {
          Util.showErrorMessageBox("网络异常,请稍候重试...");
        }
        Util.observerError(ajaxObserver, "网络异常,请稍候重试...");
        if (waitingTipMsg !== "") {
          Util.closeWaitingBox(); // 等待提示对话框 关闭
        }
      },
      complete: () => {
        // 请求完成
        Util.observerComplete(ajaxObserver);
        if (waitingTipMsg !== "") {
          Util.closeWaitingBox(); // 等待提示对话框 关闭
        }
      },
    });
    return ajaxObservable;
  }

  /*下载文件*/
  static download(
    url: string,
    fileName?: string,
    cancelRequestSource?: Subject<boolean>,
    progressCallback?: (downloaded: number, total: number | undefined) => void,
    downloadFinishedCallback?: () => void
  ) {
    let ajaxObserver: Observer<any>;
    const ajaxObservable = new Observable<any>((observer) => (ajaxObserver = observer));
    if (!cancelRequestSource) {
      cancelRequestSource = new Subject<boolean>();
    }
    const headers = new HttpHeaders().set("Cache-Control", "no-cache").set("Pragma", "no-cache");
    this.http
      .get(url, { reportProgress: true, headers, observe: "events", responseType: "blob" })
      .pipe(takeUntil(cancelRequestSource))
      .subscribe({
        next: (event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            if (progressCallback) {
              progressCallback(event.loaded, event.total);
            }
          } else if (event instanceof HttpResponse) {
            if (event.body) {
              const blob = new Blob([event.body], { type: "application/octet-stream" });
              Util.saveAs(blob, fileName);
              Util.observerNext(ajaxObserver, {});
            }
          }
        },
        error: (err) => {
          Util.observerError(ajaxObserver, err);
        },
      });
    return ajaxObservable;
  }

  /**
   * 将 Blob 对象保存为本地文件
   *
   * @param blob Blob 对象
   * @param fileName 文件名
   * @returns 无返回值
   */
  static saveAs(blob: Blob, fileName: string) {
    if ((window.navigator as any).msSaveBlob) {
      // IE 10+
      (window.navigator as any).msSaveBlob(blob, fileName);
    } else if ("download" in HTMLAnchorElement.prototype) {
      // Chrome 67+, Edge 20+
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = window.URL.createObjectURL(blob);
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    } else {
      Util.showErrorMessageBox("当前浏览器不支持下载文件");
    }
  }

  /*下载文件*/
  static downloadInNewWindow(url: string, fileName: string) {
    if (fileName) {
      if (url.indexOf("?") > 0) {
        url += "&attname=" + fileName;
      } else {
        url += "?attname=" + fileName;
      }
    }
    window.open(url);
  }

  /*异步Post请求 FormData 上传文件*/
  static uploadFile(
    url: string,
    params: FormData,
    autoError: boolean = true,
    waitingTipMsg = "",
    waitingTipTitle = ""
  ): Observable<any> {
    let ajaxObserver: Observer<any>;
    const ajaxObservable = new Observable<any>((observer) => (ajaxObserver = observer));
    if (!Util.heplerIsInit) {
      Util.modal.info({
        nzTitle: "提示",
        nzContent: "SnHelper未初始化.无法使用ajax服务.",
      });
      return ajaxObservable;
    }
    if (waitingTipMsg !== "") {
      Util.showWaitingBox(waitingTipMsg, waitingTipTitle);
    }
    const headers = new HttpHeaders().set("token", Util.token ? Util.token : "");
    url = Util.getRequestUrl(url);
    try {
      Util.http.post<Object>(url, params, { headers: headers }).subscribe({
        next: (robj: Robj<Object>) => {
          if (robj.code === 2000) {
            // 登录超时
            /*if(autoRedirectLogin){
                                Util.router.navigateByUrl('passport/login');
                              }*/
            Util.router.navigateByUrl("passport/login");
            Util.observerError(ajaxObserver, robj.message);
          } else if (robj.code === 1000) {
            Util.observerNext(ajaxObserver, robj.result);
          } else {
            if (autoError) {
              Util.showErrorMessageBox(robj.message);
            }
            Util.observerError(ajaxObserver, robj.message);
          }
        },
        error: (err) => {
          // 网络等异常 提示网络异常后,抛出完成
          if (autoError) {
            Util.showErrorMessageBox("网络异常,请稍候重试...");
          }
          Util.observerError(ajaxObserver, "网络异常,请稍候重试...");
          if (waitingTipMsg !== "") {
            Util.closeWaitingBox(); // 等待提示对话框 关闭
          }
        },
        complete: () => {
          // 请求完成
          Util.observerComplete(ajaxObserver);
          if (waitingTipMsg !== "") {
            Util.closeWaitingBox(); // 等待提示对话框 关闭
          }
        },
      });
    } catch (e) {
      console.log(e);
    }
    return ajaxObservable;
  }

  /*将Object属性转换为字符串*/
  static transformRequest(obj): string {
    const str = [];
    for (const p in obj) {
      const pval = obj[p];
      if (pval == undefined || pval == null) {
        continue;
      }
      if (typeof pval == "function") {
        continue;
      } else if (pval instanceof Date) {
        let localIsoStr = Util.toLocalISOString(pval);
        str.push(p + "=" + localIsoStr);
      } else if (typeof pval == "object") {
        str.push(p + "=" + encodeURIComponent(JSON.stringify(pval)));
      } else {
        str.push(p + "=" + encodeURIComponent(pval));
      }
    }
    return str.join("&");
  }

  /**
   * 将给定的日期对象转换为本地时间对应的 ISO 8601 格式的字符串
   *
   * @param date 需要转换的日期对象
   * @returns 返回转换后的 ISO 8601 格式字符串，不包含 'Z' 字符
   */
  static toLocalISOString(date: Date): string {
    // 获取当前时区与 UTC 的偏移量（以分钟为单位）
    const timezoneOffset = date.getTimezoneOffset();
    // 调整时间戳以反映本地时间
    const localTime = new Date(date.getTime() - timezoneOffset * 60000);
    // 生成 ISO 8601 格式的字符串
    let isoString = localTime.toISOString();
    // 移除末尾的 'Z'
    if (isoString.endsWith("Z")) {
      isoString = isoString.slice(0, -1);
    }
    return isoString;
  }

  /*------------------Observer-----------------------------------------------------*/

  /*Obserable订阅推送*/
  static observerNext(ob: Observer<any>, val: any) {
    if (ob) {
      try {
        ob.next(val);
      } catch (ex) {}
    }
  }

  static observerError(ob: Observer<any>, val: any) {
    if (ob) {
      try {
        ob.error(val);
      } catch (ex) {}
    }
  }

  static observerComplete(ob: Observer<any>) {
    if (ob) {
      try {
        ob.complete();
      } catch (ex) {}
    }
  }

  /*--------------------其它辅助方法------------------------*/
  /*------------------弹窗,提示框处理-----------------------------------------------------*/

  /*参数:
     msg: 消息文本
     okfun:点击确定按钮回调方法
     cancelfun:点击取消回调方法
     okVal:确定按钮文本
     使用:showConfirmMsgBox("您输入的信息有误!", fun,fun,"提示","确定");
     */
  static showOkMessageBox(msg: string = "", title: string = "提示", okVal: string = "确定"): Observable<boolean> {
    let dlgResultObserver: Observer<boolean>;
    let dlgResultObservable = new Observable<boolean>((observer) => (dlgResultObserver = observer));
    const confirmModal = this.modal.success({
      nzTitle: typeof title == "undefined" || title == null ? "提示" : title,
      nzContent: msg,
      nzCentered: true,
      nzWidth: 400,
      nzMaskClosable: false,
      nzNoAnimation: true,
      nzOnOk: () => {
        Util.observerNext(dlgResultObserver, true);
      },
    });
    return dlgResultObservable;
  }

  /*------------------弹窗,提示框处理-----------------------------------------------------*/

  /*参数:
     msg: 消息文本
     okfun:点击确定按钮回调方法
     cancelfun:点击取消回调方法
     okVal:确定按钮文本
     cancel:取消按钮文本
     使用:showConfirmMsgBox("您输入的信息有误!","提示","确定");
     */
  static showErrorMessageBox(msg: string = "", title: string = "提示", okVal: string = "确定"): Observable<boolean> {
    let dlgResultObserver: Observer<boolean>;
    let dlgResultObservable = new Observable<any>((observer) => (dlgResultObserver = observer));
    const confirmModal = this.modal.error({
      nzTitle: typeof title == "undefined" || title == null ? "提示" : title,
      nzContent: msg,
      nzCentered: true,
      nzWidth: 400,
      nzMaskClosable: false,
      nzNoAnimation: true,
      nzOnOk: () => {
        Util.observerNext(dlgResultObserver, {});
      },
    });
    return dlgResultObservable;
  }

  /*参数:
     msg: 消息文本
     title:窗口标题
     okVal:确定按钮文本
     cancel:取消按钮文本
     使用:showConfirmMsgBox("您输入的信息有误!", fun,fun,"提示","确定","取消");
     */
  static showConfirmBox(
    msg: string = "",
    title: string = "询问",
    okVal: string = "确定",
    cancelVal: string = "取消"
  ): Observable<boolean> {
    let dlgResultObserver: Observer<boolean>;
    const dlgResultObservable = new Observable<boolean>((observer) => (dlgResultObserver = observer));
    const confirmModal = this.modal.confirm({
      nzTitle: typeof title == "undefined" || title == null ? "询问" : title,
      nzContent: msg,
      nzCentered: true,
      nzWidth: 400,
      nzMaskClosable: false,
      nzNoAnimation: true,
      nzOnOk: () => {
        Util.observerNext(dlgResultObserver, true);
      },
      nzOkText: okVal,
      nzCancelText: cancelVal,
      nzOnCancel: () => {
        Util.observerNext(dlgResultObserver, false);
      },
    });
    return dlgResultObservable;
  }

  /*显示信息
     参数:
     content: dialog内容
     title:窗口标题
     */
  static showModalBox(content: string = "", title: string = "", dlgwidth: number = 0): void {
    if (typeof title === "undefined" || title === "") {
      title = "提示";
    }
    dlgwidth = dlgwidth || 400; // 默认宽度400
    const modalBox = this.modal.info({
      nzTitle: title,
      nzContent: content,
      nzCentered: true,
      nzWidth: dlgwidth,
      nzMaskClosable: false,
      nzNoAnimation: true,
    });
  }

  /*显示提示消息,用户无法关闭
     参数:
     msg: 消息文本
     title:窗口标题
     time:定时关闭 毫秒
     */
  static showInfoBox(msg: string = "", title: string = ""): void {
    if (msg) {
      Util.msg.info(msg);
    }
  }

  /*等待窗口,用户无法关闭
     参数:
     msg: 消息文本
     title:窗口标题
     time:定时关闭
     */
  static showWaitingBox(msg: string = "", title: string = "", dlgwidth: number = 0): any {
    if (!this.waitingBoxVisible) {
      dlgwidth = dlgwidth || 400; // 默认宽度400
      const modalBox = this.modal.error({
        nzTitle: title,
        nzContent: msg,
        nzCentered: true,
        nzWidth: dlgwidth,
        nzMaskClosable: false,
        nzNoAnimation: true,
        nzOkText: null,
        nzCancelText: null,
      });
      this.waitingBoxVisible = true;
    }
  }

  /*关闭等待窗口,用户无法关闭参数:*/
  static closeWaitingBox(): void {
    if (this.waitingBoxVisible) {
      this.modal.closeAll(); // 关闭所有弹窗
      this.waitingBoxVisible = false;
    } else {
      this.showWaitingBox(); // 如果等待窗口不可见，可以选择重新打开等待窗口
    }
  }
}
