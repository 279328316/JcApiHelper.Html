import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsontoolComponent } from './jsontool.component';

describe('JsontoolComponent', () => {
  let component: JsontoolComponent;
  let fixture: ComponentFixture<JsontoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsontoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsontoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
