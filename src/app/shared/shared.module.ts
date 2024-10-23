import {NgModule, Type} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// region: third libs
import { SHARED_ZORRO_MODULES  } from './shared-zorro.module';
import { ClipboardModule } from "ngx-clipboard";

import { SyntaxHighLightComponent } from '@pages/components/syntax-highlight/syntax-highlight.component';

const THIRDMODULES = [
  SHARED_ZORRO_MODULES,
  ClipboardModule
];
// endregion

// region: your componets & directives
const COMPONENTS : Type<any>[] = [SyntaxHighLightComponent];
const DIRECTIVES : Type<any>[] = [];
// endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})
export class SharedModule {
}
