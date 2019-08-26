import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpToolComponent } from './httptool.component';

describe('HttptoolComponent', () => {
  let component: HttpToolComponent;
  let fixture: ComponentFixture<HttpToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
