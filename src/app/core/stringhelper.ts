export class StringHelper {
  /*toLocalString() IE11中的toLocalString会出错*/
  arrayToString(tArray: Array<any>, splitChar: string): string {
    let str = "";
    splitChar = splitChar ? splitChar : ",";
    if (tArray) {
      for (let i = 0; i < tArray.length; i++) {
        if (str === "") {
          str += tArray[i].toString();
        } else {
          str += splitChar + tArray[i].toString();
        }
      }
    }
    return str;
  }

  /*对象转数组*/
  static objTransformToArray(obj) {
    let formParamsArr = [];
    for (var i in obj) {
      var o = {};
      o[i] = obj[i];
      formParamsArr.push(o);
    }
    return formParamsArr;
  }

  /*生成Guid*/
  static newGuid(): string {
    let guid = "";
    for (let i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
    }
    return guid;
  }

  /*首字母小写*/
  static firstToLower(str: string): string {
    let result = str;
    if (result) {
      result = result[0].toLowerCase() + result.substring(1);
    }
    return result;
  }

  /*首字母大写*/
  static firstToUpper(str: string): string {
    let result = str;
    if (result) {
      result = result[0].toUpperCase() + result.substring(1);
    }
    return result;
  }

  /*文本对比
   * cpObj:{value1:string,value2:string}
   * */
  static textCompare(cpObj: any): { value1: string; value2: string } {
    if (!cpObj) {
      return cpObj;
    }
    if (!cpObj.value1_style) {
      cpObj.value1_style = "background-color:#FEC8C8;";
    }
    if (!cpObj.value2_style) {
      cpObj.value2_style = "background-color:#90EE90;";
      //cpObj.value2_style = 'text-decoration:line-through';
    }
    if (!cpObj.eq_min) {
      cpObj.eq_min = 3;
    }
    if (!cpObj.eq_index) {
      cpObj.eq_index = 5;
    }
    if (!cpObj.value1 || !cpObj.value2) {
      return cpObj;
    }
    let ps: any = {
      v1_i: 0,
      v1_new_value: "",
      v2_i: 0,
      v2_new_value: "",
    };
    while (ps.v1_i < cpObj.value1.length && ps.v2_i < cpObj.value2.length) {
      if (cpObj.value1[ps.v1_i] == cpObj.value2[ps.v2_i]) {
        ps.v1_new_value += cpObj.value1[ps.v1_i].replace(/</g, "<").replace(">", ">");
        ps.v2_new_value += cpObj.value2[ps.v2_i].replace(/</g, "<").replace(">", ">");
        ps.v1_i += 1;
        ps.v2_i += 1;
        if (ps.v1_i >= cpObj.value1.length) {
          ps.v2_new_value +=
            "<span style='" +
            cpObj.value2_style +
            "'>" +
            cpObj.value2.substr(ps.v2_i).replace(/</g, "<").replace(">", ">") +
            "</span>";
          break;
        }
        if (ps.v2_i >= cpObj.value2.length) {
          ps.v1_new_value +=
            "<span style='" +
            cpObj.value1_style +
            "'>" +
            cpObj.value1.substr(ps.v1_i).replace(/</g, "<").replace(">", ">") +
            "</span>";
          break;
        }
      } else {
        ps.v1_index = ps.v1_i + 1;
        ps.v1_eq_length = 0;
        ps.v1_eq_max = 0;
        ps.v1_start = ps.v1_i + 1;
        while (ps.v1_index < cpObj.value1.length) {
          if (cpObj.value1[ps.v1_index] == cpObj.value2[ps.v2_i + ps.v1_eq_length]) {
            ps.v1_eq_length += 1;
          } else if (ps.v1_eq_length > 0) {
            if (ps.v1_eq_max < ps.v1_eq_length) {
              ps.v1_eq_max = ps.v1_eq_length;
              ps.v1_start = ps.v1_index - ps.v1_eq_length;
            }
            ps.v1_eq_length = 0;
            break; //只寻找最近的
          }
          ps.v1_index += 1;
        }
        if (ps.v1_eq_max < ps.v1_eq_length) {
          ps.v1_eq_max = ps.v1_eq_length;
          ps.v1_start = ps.v1_index - ps.v1_eq_length;
        }

        ps.v2_index = ps.v2_i + 1;
        ps.v2_eq_length = 0;
        ps.v2_eq_max = 0;
        ps.v2_start = ps.v2_i + 1;
        while (ps.v2_index < cpObj.value2.length) {
          if (cpObj.value2[ps.v2_index] == cpObj.value1[ps.v1_i + ps.v2_eq_length]) {
            ps.v2_eq_length += 1;
          } else if (ps.v2_eq_length > 0) {
            if (ps.v2_eq_max < ps.v2_eq_length) {
              ps.v2_eq_max = ps.v2_eq_length;
              ps.v2_start = ps.v2_index - ps.v2_eq_length;
            }
            ps.v1_eq_length = 0;
            break; //只寻找最近的
          }
          ps.v2_index += 1;
        }
        if (ps.v2_eq_max < ps.v2_eq_length) {
          ps.v2_eq_max = ps.v2_eq_length;
          ps.v2_start = ps.v2_index - ps.v2_eq_length;
        }
        if (ps.v1_eq_max < cpObj.eq_min && ps.v1_start - ps.v1_i > cpObj.eq_index) {
          ps.v1_eq_max = 0;
        }
        if (ps.v2_eq_max < cpObj.eq_min && ps.v2_start - ps.v2_i > cpObj.eq_index) {
          ps.v2_eq_max = 0;
        }
        if (ps.v1_eq_max == 0 && ps.v2_eq_max == 0) {
          ps.v1_new_value +=
            "<span style='" +
            cpObj.value1_style +
            "'>" +
            cpObj.value1[ps.v1_i].replace(/</g, "<").replace(">", ">") +
            "</span>";
          ps.v2_new_value +=
            "<span style='" +
            cpObj.value2_style +
            "'>" +
            cpObj.value2[ps.v2_i].replace(/</g, "<").replace(">", ">") +
            "</span>";
          ps.v1_i += 1;
          ps.v2_i += 1;

          if (ps.v1_i >= cpObj.value1.length) {
            ps.v2_new_value +=
              "<span style='" +
              cpObj.value2_style +
              "'>" +
              cpObj.value2.substr(ps.v2_i).replace(/</g, "<").replace(">", ">") +
              "</span>";
            break;
          }
          if (ps.v2_i >= cpObj.value2.length) {
            ps.v1_new_value +=
              "<span style='" +
              cpObj.value1_style +
              "'>" +
              cpObj.value1.substr(ps.v1_i).replace(/</g, "<").replace(">", ">") +
              "</span>";
            break;
          }
        } else if (ps.v1_eq_max > ps.v2_eq_max) {
          ps.v1_new_value +=
            "<span style='" +
            cpObj.value1_style +
            "'>" +
            cpObj.value1
              .substr(ps.v1_i, ps.v1_start - ps.v1_i)
              .replace(/</g, "<")
              .replace(">", ">") +
            "</span>";
          ps.v1_i = ps.v1_start;
        } else {
          ps.v2_new_value +=
            "<span style='" +
            cpObj.value2_style +
            "'>" +
            cpObj.value2
              .substr(ps.v2_i, ps.v2_start - ps.v2_i)
              .replace(/</g, "<")
              .replace(">", ">") +
            "</span>";
          ps.v2_i = ps.v2_start;
        }
      }
    }
    cpObj.value1 = ps.v1_new_value;
    cpObj.value2 = ps.v2_new_value;
    return cpObj;
  }
}
