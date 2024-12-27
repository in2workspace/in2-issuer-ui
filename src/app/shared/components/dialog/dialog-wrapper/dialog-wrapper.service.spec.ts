import { TestBed } from '@angular/core/testing';

import { DialogWrapperService } from './dialog-wrapper.service';

describe('DialogWrapperService', () => {
  let service: DialogWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
