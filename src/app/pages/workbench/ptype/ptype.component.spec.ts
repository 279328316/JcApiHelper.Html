import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtypeComponent } from './ptype.component';

describe('PtypeComponent', () => {
  let component: PtypeComponent;
  let fixture: ComponentFixture<PtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
