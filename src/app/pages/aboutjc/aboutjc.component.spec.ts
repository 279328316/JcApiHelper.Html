import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutjcComponent } from './aboutjc.component';

describe('AboutjcComponent', () => {
  let component: AboutjcComponent;
  let fixture: ComponentFixture<AboutjcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutjcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutjcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
