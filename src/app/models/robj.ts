/*服务器请求返回对象
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

export class Robj<T> {
  code: number;
  result: T;
  message = "";
}

/*Api请求ContentType
  @param json Json格式
  @param form Form格式
  * */
export class ContentType {
  static json: string = "json";
  static form: string = "form";
}

/*AjaxOptions
  * */
export class AjaxOptions {
  url: string;
  params: any = {};
  contentType: string = ContentType.form;
  autoError: boolean = true;
  autoRedirectLogin: boolean = true;
  waitingTipMsg = "";
  waitingTipTitle = ""
}
