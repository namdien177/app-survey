import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformingTestingComponent } from './performing-testing.component';

describe('PerformingTestingComponent', () => {
  let component: PerformingTestingComponent;
  let fixture: ComponentFixture<PerformingTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformingTestingComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformingTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
