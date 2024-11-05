
/*Key Value对象*/
export class KeyValueObj {
  isSelected: boolean = false;
  key: any;
  value: any;

  constructor(key: any, value: any) {
    this.key = key;
    this.value = value;
  }
}

// KeyValueItem 下拉选择Item对象
export class KeyValueItem {
  id: string;
  isSelected: boolean;
  itemText: string; // Item显示文本
  itemValue: string; // Item值
  constructor(itemText: string, itemValue: string) {
    this.itemText = itemText;
    this.itemValue = itemValue;
  }
}

