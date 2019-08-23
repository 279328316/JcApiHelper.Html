import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsockettoolComponent } from './websockettool.component';

describe('WebsockettoolComponent', () => {
  let component: WebsockettoolComponent;
  let fixture: ComponentFixture<WebsockettoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsockettoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsockettoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
