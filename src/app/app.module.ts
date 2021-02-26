import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {SharedModule} from '@shared/shared.module';
import {LayoutModule} from '@layout/layout.module';
import { PagesModule } from '@pages/pages.module';
import {RouteReuseStrategy} from '@angular/router';
import {AppReuseStrategy} from '@core/appreusestrategy';
import {IconModule} from "@shared/icon.module";
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    IconModule,
    LayoutModule,
    BrowserAnimationsModule,
    PagesModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: AppReuseStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
