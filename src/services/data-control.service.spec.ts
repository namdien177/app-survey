import { TestBed } from '@angular/core/testing';

import { DataControlService } from './data-control.service';

describe('DataControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataControlService = TestBed.get(DataControlService);
    expect(service).toBeTruthy();
  });
});
