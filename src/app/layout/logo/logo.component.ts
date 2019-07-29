import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <div>
      <!--<a>
        <img src="assets/images/logo/logo.png"
             style="width:42px;height:28px; margin-top: 0px;">
      </a>-->
      <h2 class="ml8 line vcenter">
        <a routerLink="/">Jc ApiHelper</a>
      </h2>
    </div>`
})
export class LogoComponent{
  constructor() {
  }
}
