import { TestBed } from '@angular/core/testing';

import { CredentialissuanceService } from './credentialissuance.service';

describe('CredentialissuanceService', () => {
  let service: CredentialissuanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialissuanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
