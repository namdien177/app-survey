import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeTestingComponent } from './make-testing.component';

describe('MakeTestingComponent', () => {
  let component: MakeTestingComponent;
  let fixture: ComponentFixture<MakeTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeTestingComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
