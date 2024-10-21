export class DateHelper {
  // 日期格式化
  static formatDate(date, fmt = "yyyy-MM-dd"): string {
    if (!date) {
      return ""; //默认传空字符串
    }
    try {
      if (typeof date == "string") {
        // 处理传入格式为字符串
        date = new Date(date);
      }
      const o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
    } catch (err) {
      fmt = "";
    }
    return fmt;
  }

  /*本周第一天*/
  static getCurWeekFirstDay(value) {
    if (value == "" || value == undefined) {
      return value;
    }
    if (value.length == 10) {
      value = value * 1000;
    }
    let myDate = new Date(value);
    let day = myDate.getDay(); // 回退7天后是星期几？
    let time = myDate.getDate() - day + (day === 0 ? -6 : 1);
    let startTime = new Date(myDate.setDate(time));
    let startDateTime = startTime.getFullYear() + "-" + (startTime.getMonth() + 1) + "-" + startTime.getDate();
    return startDateTime;
  }

  //日期格式化处理
  static formatRelativeTime(value: Date | number | string, format: string): string {
    let date: Date;

    try {
      if (value instanceof Date) {
        date = value;
      } else if (typeof value === "number") {
        date = new Date(value);
      } else if (typeof value === "string") {
        date = new Date(value);

        // Check if date parsing was successful
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date string");
        }
      } else {
        throw new Error("Invalid input type");
      }
    } catch (error) {
      console.error(`Error parsing date: ${error.message}`);
      return format; // Return the original format in case of an error
    }

    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    let relativeTime: string;

    if (diffInMinutes < 1) {
      relativeTime = "刚刚";
    } else if (diffInHours < 1) {
      relativeTime = `${diffInMinutes} 分钟前`;
    } else if (diffInDays < 1) {
      relativeTime = `${diffInHours} 小时前`;
    } else if (diffInDays < 30) {
      relativeTime = `${diffInDays} 天前`;
    } else if (diffInMonths < 12) {
      relativeTime = `${diffInMonths} 个月前`;
    } else {
      relativeTime = `${diffInYears} 年前`;
    }

    return format.replace("{{relativeTime}}", relativeTime);
  }

  // 日期 有效性校验
  static validDateStr(dateStr: string): boolean {
    const iDateHelperum = this.regexValidate("^[0-9]*$", dateStr); // 校验是否为数字
    let isValid = false;
    if (iDateHelperum && (dateStr.length === 4 || dateStr.length === 6 || dateStr.length === 8)) {
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
  static regexValidate(regex: any, validateString: string): boolean {
    const re = new RegExp(regex);
    return re.test(validateString);
  }

  // 校验日期是否合法
  static isdate(intYear: number, intMonth: number, intDay: number): boolean {
    if (intMonth > 12 || intMonth < 1) {
      return false;
    }
    if (intDay < 1 || intDay > 31) {
      return false;
    }
    if ((intMonth === 4 || intMonth === 6 || intMonth === 9 || intMonth === 11) && intDay > 30) {
      return false;
    }
    if (intMonth === 2) {
      if (intDay > 29) {
        return false;
      }
      if (((intYear % 100 === 0 && intYear % 400 !== 0) || intYear % 4 !== 0) && intDay > 28) {
        return false;
      }
    }
    return true;
  }

  // 填充开始日期
  static setStartDate(startDateStr: string, queryObj: any, feild: string): void {
    if (startDateStr.length === 4) {
      queryObj[feild] = queryObj[feild] + "-" + "01-01";
    } else if (startDateStr.length === 6) {
      queryObj[feild] = queryObj[feild].substring(0, 4) + "-" + queryObj[feild].substring(4, 6) + "-01";
    } else {
      queryObj[feild] =
        queryObj[feild].substring(0, 4) + "-" + queryObj[feild].substring(4, 6) + "-" + queryObj[feild].substring(6, 8);
    }
  }

  // 填充结束日期
  static setEndDate(endDateStr: any, queryObj: any, feild: string): void {
    if (endDateStr.length === 4) {
      queryObj[feild] = endDateStr + "-12-31";
    } else if (endDateStr.length === 6) {
      let day = "31";
      const intMonth = parseInt(endDateStr.substring(4, 6), 10);
      const year = parseInt(endDateStr.substring(0, 4), 10);
      // let day= new Date(endDateStr.substring(0,4),endDateStr.substring(4,2),0);
      if (intMonth === 4 || intMonth === 6 || intMonth === 9 || intMonth === 11) {
        day = "30";
      }
      if (intMonth === 2) {
        if (this.leapyear(year)) {
          day = "29";
        } else {
          day = "28";
        }
      }
      queryObj[feild] = endDateStr.substring(0, 4) + "-" + endDateStr.substring(4, 6) + "-" + day + " 23:59:59";
    } else {
      queryObj[feild] =
        endDateStr.substring(0, 4) + "-" + endDateStr.substring(4, 6) + "-" + endDateStr.substring(6, 8) + " 23:59:59";
    }
  }

  // 判断闰年
  static leapyear(year): boolean {
    if ((year % 400 === 0 || year % 100 !== 0) && year % 4 === 0) {
      return true;
    } else {
      return false;
    }
  }

  /*只有两个都存在时进行比较*/
  static compareObjDate(startDateStr: string, endDateStr: string, queryObj: any): boolean {
    if (!queryObj[startDateStr] || !queryObj[endDateStr]) {
      return true;
    }
    const startStr = queryObj[startDateStr].replace(/-/g, "/");
    const endStr = queryObj[endDateStr].replace(/-/g, "/");
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    if (endDate < startDate) {
      queryObj[startDateStr] = "";
      queryObj[endDateStr] = "";
      return false;
      // throw new Error('结束日期不能小于开始日期.');
    }
    return true;
  }

  /*只有两个都存在时进行比较*/
  static compareDate(startDate: any, endDate: any): number {
    let result = 0;
    if (typeof startDate == "string") {
      startDate = new Date(startDate.replace(/-/g, "/"));
    }
    if (typeof endDate == "string") {
      endDate = new Date(endDate.replace(/-/g, "/"));
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
  static addDate(
    date: any,
    year: number = 0,
    month: number = 0,
    days: number = 0,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    msec: number = 0
  ): Date {
    if (typeof date == "string") {
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

  /*计算两个时间相差天数*/
  static dateDifference(sDate1, sDate2) {
    let dateSpan, tempDate, iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays;
  }

  /*获取本周开始日期*/
  static getWeekStartDate() {
    let now = new Date(); //当前日期
    let nowYear = now.getFullYear(); //当前年
    let nowMonth = now.getMonth(); //当前月
    let nowDay = now.getDate(); //当前日
    let nowDayOfWeek = now.getDay(); //今天本周的第几天
    let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    return DateHelper.formatDate(weekStartDate);
  }

  /*获取本周结束日期*/
  static getWeekEndDate() {
    let now = new Date(); //当前日期
    let nowYear = now.getFullYear(); //当前年
    let nowMonth = now.getMonth(); //当前月
    let nowDay = now.getDate(); //当前日
    let nowDayOfWeek = now.getDay(); //今天本周的第几天
    let weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return DateHelper.formatDate(weekEndDate);
  }

  /*获取本月开始日期*/
  static getMonthStartDate() {
    let now = new Date(); //当前日期
    let nowYear = now.getFullYear(); //当前年
    let nowMonth = now.getMonth(); //当前月
    let monthStartDate = new Date(nowYear, nowMonth, 1);
    return DateHelper.formatDate(monthStartDate);
  }

  /*获取本月结束日期*/
  static getMonthEndDate() {
    let now = new Date(); //当前日期
    let nowYear = now.getFullYear(); //当前年
    let nowMonth = now.getMonth(); //当前月
    let monthEndDate = new Date(nowYear, nowMonth, DateHelper.getMonthDays(nowMonth));
    return DateHelper.formatDate(monthEndDate);
  }

  //获得某月的天数
  static getMonthDays(myMonth) {
    let now = new Date(); //当前日期
    let nowYear = now.getFullYear(); //当前年
    let monthStartDate: any = new Date(nowYear, myMonth, 1);
    let monthEndDate: any = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  }
}
