import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LayoutWorkbenchComponent} from "@layout/workbench/workbench.component";
import {WorkbenchComponent} from "./index/workbench.component";
import {LayoutWorkbenchIndexComponent} from "@layout/workbench/index/workbench.component";
import {ActionComponent} from '@pages/workbench/action/action.component';
import {PTypeComponent} from "@pages/workbench/ptype/ptype.component";
import {TsViewerComponent} from "@pages/workbench/tsviewer/tsviewer.component";

const routes: Routes = [
  { path: '',
    component: LayoutWorkbenchComponent,
    children: [
        { path: '',redirectTo:'/workbench/index', pathMatch:'full'},
        { path: 'action/:actionId',component : ActionComponent},
        { path: 'ptype/:ptypeId',component : PTypeComponent},
        { path: 'tsviewer/:itemType/:itemId',component : TsViewerComponent,data:{title:'Ts'}}
    ]
  },
  { path: 'index',
    component: LayoutWorkbenchIndexComponent,
    children: [
        { path: '',component : WorkbenchComponent,data:{reuse:true}}
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkbenchRoutingModule {
}
