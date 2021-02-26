import {NgModule} from '@angular/core';

import {WorkbenchRoutingModule} from './workbench.routes';
// 在需要使用外部url链接的ts文件中，引入DomSanitizer类
// import { DomSanitizer } from '@angular/platform-browser';
import {SharedModule} from '@shared/shared.module';
import {LayoutModule} from '@layout/layout.module';
import {WorkbenchComponent} from "./index/workbench.component";
import {ApiService} from "./service/api.service";
import {ControllerFilterPipe} from "./service/controllerfilter.pipe";
import {ActionComponent} from './action/action.component';
import {PTypeComponent} from './ptype/ptype.component';
import {TsViewerComponent} from './tsviewer/tsviewer.component';

@NgModule({
  imports: [
    SharedModule,
    LayoutModule,
    WorkbenchRoutingModule
  ],
  declarations: [
    ControllerFilterPipe,
    WorkbenchComponent,
    ActionComponent,
    PTypeComponent,
    TsViewerComponent
  ],
  providers: [ApiService]
})
export class WorkbenchModule {
}
