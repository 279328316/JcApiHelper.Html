import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';

import { IndexComponent } from './index/index.component';
import {JsonToolComponent} from "@pages/jsontool/jsontool.component";
import {WebSocketToolComponent} from '@pages/websockettool/websockettool.component';
import {AboutJcComponent} from "@pages/aboutjc/aboutjc.component";

// single pages
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import {HttpToolComponent} from "@pages/httptool/httptool.component";

const routes: Routes = [
    {
        path: '',
        component: LayoutDefaultComponent,
        children: [
            { path: '',redirectTo:'index', pathMatch:'full'},
            { path: 'index',component:IndexComponent,data:{title:'Home'}},
            { path: 'jsontool',component:JsonToolComponent,data:{title:'JsonFormat'}},
            { path: 'httptool',component:HttpToolComponent,data:{title:'HttpTool'}},
            { path: 'websocket',component:WebSocketToolComponent,data:{title:'WebSocket'}},
            { path: 'aboutjc',component:AboutJcComponent,data:{title:'AboutJc'}}
        ]
    },
    {   // workbench
        path: 'workbench',loadChildren: () => import('./workbench/workbench.module').then(m => m.WorkbenchModule)
    },
    // 单页不包裹Layout
    { path: '403', component: Exception403Component },
    { path: '404', component: Exception404Component },
    { path: '500', component: Exception500Component },
    { path: '**', redirectTo: '404' }
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
