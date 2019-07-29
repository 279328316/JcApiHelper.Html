import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-smalllogo',
  template: `
    <div>
      <h3 class="ml8 line vcenter">
        <a routerLink="/">Jc ApiHelper</a>
      </h3>
    </div>`
})
export class SmallLogoComponent{
  constructor() {
  }
}
