
// 文件对象
export class FileObj {
  file: any; // 文件
  fileId: string; // 文件Id
  fileName: string; // 文件名称
  fileSize: number; // 文件大小
  fileSizeStr: string; // 文件大小描述
  fileType: string; // 文件类型
  fileStatus: number; // 文件状态 -1 无效上传文件 0 文件待上传 1 文件上传中 2 文件已上传
  fileStatusStr: string; // 文件状态描述 -1 无效文件 0 待上传 1 上传中 2 已上传
  startUploadTime: number; // 文件上传开始时间 number类型 performance.now()
  uploadSpeed: string; // 文件上传速度
  uploadedSize = 0; // 已上传文件大小
  nowUploadedSize = 0; // 本次已上传文件大小
  progressVal: number; // 文件上传进度
  progressStr: string; // 上传进度描述

}

/*服务器请求返回对象
 @param url 请求地址
 @param params 请求参数
 @param autoSuccess 自动提示成功消息
 @param autoError 自动提示失败消息
 @param autoNetError 自动提示网络异常消息
 @param waitingTipMsg 请求等待提示消息
 @param waitingTipTitle 请求等待提示Header
 * */
export class AjaxOption {
  url: string;
  params: any;
  autoSuccess = false;
  autoError = true;
  autoNetError = false;
  waitingTipMsg = '';
  waitingTipTitle = '';
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
  constructor(text: string, value: string = '') {
    this.text = text;
    this.value = value;
  }
}
