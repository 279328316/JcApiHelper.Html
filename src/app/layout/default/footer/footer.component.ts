import {Component, ViewChild} from '@angular/core';

@Component({
  selector: 'layout-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {
  date:Date = new Date();
  constructor() {
  }
}
