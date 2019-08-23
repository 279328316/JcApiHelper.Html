import {NgModule} from '@angular/core';

import {NgZorroAntdModule} from 'ng-zorro-antd';
import {SharedModule} from '@shared/shared.module';

import {KeywordHighlightPipe} from '@core/keyworkhl.pipe';

import {PagesRoutingModule} from './pages-routing.module';

import {IndexComponent} from './index/index.component';
import {JsonToolComponent} from "@pages/jsontool/jsontool.component";
import { AboutJcComponent } from './aboutjc/aboutjc.component';

// single pages
import {Exception403Component} from './exception/403.component';
import {Exception404Component} from './exception/404.component';
import {Exception500Component} from './exception/500.component';
import { WebsockettoolComponent } from './websockettool/websockettool.component';

@NgModule({
  imports: [SharedModule, NgZorroAntdModule, PagesRoutingModule],
  declarations: [
    KeywordHighlightPipe,
    IndexComponent,
    JsonToolComponent,
    // single pages
    Exception403Component,
    Exception404Component,
    Exception500Component,
    AboutJcComponent,
    WebsockettoolComponent],
  providers: []
})

export class PagesModule {
}
