import { TestBed } from '@angular/core/testing';

import { MandatorService } from './mandator.service';

describe('MandatorService', () => {
  let service: MandatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MandatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
