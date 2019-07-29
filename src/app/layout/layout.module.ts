import { NgModule } from '@angular/core';
import { LayoutDefaultComponent } from './default/default.component';

import {HeaderComponent} from './default/header/header.component'
import {FooterComponent} from "./default/footer/footer.component";

import { SmallLogoComponent } from './logo/small.component';
import { LogoComponent } from './logo/logo.component';


import {WorkbenchHeaderComponent} from "./workbench/header/header.component";
import { LayoutWorkbenchComponent } from './workbench/workbench.component';

import {SharedModule} from '@shared/shared.module';
import {LayoutWorkbenchIndexComponent} from "@layout/workbench/index/workbench.component";


const COMPONENTS = [
  FooterComponent,
  LayoutDefaultComponent,
  LayoutWorkbenchComponent,
  LayoutWorkbenchIndexComponent
];

const HEADERCOMPONENTS = [
  SmallLogoComponent,
  LogoComponent,
  HeaderComponent,
  WorkbenchHeaderComponent,
  FooterComponent,
];

@NgModule({
  imports: [SharedModule],
  providers: [],
  declarations: [...COMPONENTS, ...HEADERCOMPONENTS],
  exports: [...COMPONENTS]
})
export class LayoutModule {
}
