
/*显示方式*/
export enum DisplayType {
  Text = 'Text', // 文本框
  Tag = 'Tag', // NzTag标签
  TextArea = 'TextArea', // 多行文本框
  Pre = 'Pre', // 原样式输出文本域
  Password = 'Password', // 密码框
  ProgressBar = 'ProgressBar', // 进度条
  DatePicker = 'DatePicker', // 日期选择器
  DateTimePicker = 'DateTimePicker', // 日期时间选择器
  TimePicker = 'TimePicker', // 时间选择器
  RangePicker = 'RangePicker', // 日期范围选择器
  RadioGroup = 'RadioGroup', // 单选框组合
  Checkbox = 'Checkbox', // 复选框
  Select = 'Select', // 下拉框
  Switch = 'Switch', // 开关
  UploadFile = 'UploadFile', // 文件上传
  Input = 'Input', // 输入框
  InputNumber = 'InputNumber', // 数字输入框
  Rate = 'Rate', // 评分
  ColorPicker = 'ColorPicker', // 颜色选择器
  Slider = 'Slider', // 滑动输入条
}

/*TsPiModel*/
export class TsPi {
  name: string; // 参数名
  isSelected: boolean; // 是否选中
  tsType: string; // Ts参数类型
  summary: string; // Summary
  isEnum = false; // 是否枚举

  isQuery = false; // 是否查询参数
  queryDisplayType = DisplayType.InputNumber; // 查询显示类型
  isList = false; // 是否列表参数
  isListSort = false; // 是否列表排序参数
  listDisplayType = DisplayType.Text; // 列表显示类型
  isEdit = false; // 是否编辑参数
  editDisplayType = DisplayType.Input; // 编辑显示类型
  isRequire = false; // 是否必填
  isDetail = false; // 是否详情显示
  detailDisplayType = DisplayType.Text; // 详情显示类型
}

// 枚举显示类型
export class EnumDisplayType {

  static defaultDisplayType = DisplayType.Text; // 默认显示类型
  static defaultEditType = DisplayType.Select; // 默认编辑类型

  /**
   * 获取显示类型
   */
  static getDisplayType() {
    let list: DisplayType[] = [];
    list.push(DisplayType.Text); // 文本
    list.push(DisplayType.Tag); // NzTag标签
  }

  /**
   * 获取编辑显示类型
   */
  static getEditType() {
    let list: DisplayType[] = [];
    list.push(DisplayType.Select);  // 下拉框
    list.push(DisplayType.RadioGroup);  // 单选框组合
  }
}

// 数字显示类型
export class NumberDisplayType {

  static defaultDisplayType = DisplayType.Text; // 默认显示类型
  static defaultEditType = DisplayType.InputNumber; // 默认编辑类型

  /**
   * 获取显示类型
   */
  static getDisplayType() {
    let list: DisplayType[] = [];
    list.push(DisplayType.Text); // 文本
    list.push(DisplayType.Tag); // NzTag标签
    list.push(DisplayType.ProgressBar); // 进度条
    list.push(DisplayType.Rate); // 评分
  }

  /**
   * 获取编辑显示类型
   */
  static getEditType() {
    let list: DisplayType[] = [];
    list.push(DisplayType.InputNumber); // 数字输入框
    list.push(DisplayType.RadioGroup);
  }
}


// boolean显示类型
export class BooleanDisplayType {

  static defaultDisplayType = DisplayType.Text; // 默认显示类型
  static defaultEditType = DisplayType.Switch; // 默认编辑类型

  /**
   * 获取显示类型
   */
  static getDisplayType() {
    let list: DisplayType[] = [];
    list.push(DisplayType.Text); // 文本
    list.push(DisplayType.Tag); // NzTag标签
    list.push(DisplayType.Switch); // 开关
    list.push(DisplayType.Checkbox); // 复选框
  }

  /**
   * 获取编辑显示类型
   */
  static getEditType() {
    let list: DisplayType[] = [];
    list.push(DisplayType.Switch); // 开关
    list.push(DisplayType.Checkbox); // 复选框
    list.push(DisplayType.RadioGroup); // 单选框组合
    list.push(DisplayType.Select); // 下拉框
  }
}

// Date显示类型
export class DateDisplayType {

  static defaultDisplayType = DisplayType.Text; // 默认显示类型
  static defaultEditType = DisplayType.DatePicker; // 默认编辑类型

  /**
   * 获取显示类型
   */
  static getDisplayType() {
    let list: DisplayType[] = [];
    list.push(DisplayType.Text); // 文本
    list.push(DisplayType.Tag); // NzTag标签
  }

  /**
   * 获取编辑显示类型
   */
  static getEditType() {
    let list: DisplayType[] = [];
    list.push(DisplayType.DatePicker); // 开关
    list.push(DisplayType.RangePicker); // 日期范围选择器
  }
}


// string显示类型
export class StringDisplayType {

  static defaultDisplayType = DisplayType.Text; // 默认显示类型
  static defaultEditType = DisplayType.Input; // 默认编辑类型

  /**
   * 获取显示类型
   */
  static getDisplayType() {
    let list: DisplayType[] = [];
    list.push(DisplayType.Text); // 文本
    list.push(DisplayType.Tag); // NzTag标签
    list.push(DisplayType.Pre); // 文本域
  }

  /**
   * 获取编辑显示类型
   */
  static getEditType() {
    let list: DisplayType[] = [];
    list.push(DisplayType.Input); // 输入框
    list.push(DisplayType.UploadFile); // 文件上传
    list.push(DisplayType.TextArea); // 多行文本框
  }
}