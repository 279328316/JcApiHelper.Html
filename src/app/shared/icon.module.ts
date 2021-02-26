

import {NgModule} from "@angular/core";

// 引入你需要的图标，比如你需要 fill 主题的 AccountBook Alert 和 outline 主题的 Alert，推荐 ✔️
import { IconDefinition } from '@ant-design/icons-angular';
import { DesktopOutline,AppstoreOutline,SyncOutline} from '@ant-design/icons-angular/icons';
import {NzIconModule} from "ng-zorro-antd/icon";
const icons: IconDefinition[] = [ DesktopOutline,AppstoreOutline,SyncOutline ];


@NgModule({
  imports: [
    NzIconModule.forRoot(icons),
  ],
  exports: [
  ]
})
export class IconModule {
}
